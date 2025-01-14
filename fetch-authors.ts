import axios from 'axios';
import {loadAll, CORE_SCHEMA} from 'js-yaml';
import {readFileSync, writeFileSync} from 'fs';
import {DOMParser, XMLSerializer} from '@xmldom/xmldom';
import {Author, OriginalPlay, Play} from './src/types';

import authorData from './src/authors.json';

interface AuthorRecord {
  name: string;
  gender?: string;
  gnd?: string;
  image?: string;
  birth?: {
    date?: string;
    place?: string;
    placeId?: string;
  };
  death?: {
    date?: string;
    place?: string;
    placeId?: string;
  };
  ambiguous?: boolean;
}
interface Node {
  name: string;
  fullname?: string;
  gender?: string;
}

interface Edge {
  source: string;
  target: string;
  weight: number;
}

const authors: {[index: string]: AuthorRecord} = {...authorData};

let data: Play[] = [];
let originals: OriginalPlay[] = [];
try {
  data = loadAll(readFileSync('./data.yaml', 'utf8'), null, {
    schema: CORE_SCHEMA,
  }) as Play[];
  originals = loadAll(readFileSync('./originals.yaml', 'utf8'), null, {
    schema: CORE_SCHEMA,
  }) as OriginalPlay[];
} catch (error) {
  console.log(error);
}

const plays = data.map((p: Play) => {
  const authors = p.author ? [p.author] : p.authors || [];
  const play = {...p, authors};
  return play;
});

originals.forEach((o) => {
  o.authors = o.author ? [o.author] : o.authors || [];
  delete o.author;
});

const argv = process.argv.slice(2);

const authorIds = [
  plays.map((p) => p.authors.filter((a) => a.wikidata).map((a) => a.wikidata)),
  originals.map((p) =>
    p.authors?.filter((a) => a.wikidata).map((a) => a.wikidata)
  ),
]
  .flat(2)
  .filter((id, index, self) => self.indexOf(id) === index);

const endpoint = 'https://query.wikidata.org/sparql';

async function fetchAuthors() {
  const results: {[index: string]: AuthorRecord} = {};
  for (let i = 0; i < authorIds.length; i++) {
    const id = authorIds[i];
    const author = authors[id as string];
    if (author && !argv.includes(id as string)) {
      console.log(`${id} (${author.name}) exists`);
      results[id as string] = author;
    } else {
      const sparql = `
SELECT ?author ?authorLabel ?birthDate ?deathDate ?gender ?genderLabel
  ?birthPlace ?birthPlaceLabel ?birthCoord
  ?deathPlace ?deathPlaceLabel ?deathCoord
  ?img ?gnd
WHERE {
  BIND (wd:${id} AS ?author)
  OPTIONAL { ?author wdt:P569 ?birthDate. }
  OPTIONAL { ?author wdt:P570 ?deathDate. }
  OPTIONAL { ?author wdt:P21 ?gender. }
  OPTIONAL { ?author wdt:P19 ?birthPlace. }
  OPTIONAL { ?author wdt:P20 ?deathPlace. }
  #OPTIONAL { ?birthPlace wdt:P625 ?birthCoord. }
  OPTIONAL { ?author wdt:P18 ?img. }
  OPTIONAL { ?author wdt:P227 ?gnd. }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "de,en". }
}
`;
      const url = `${endpoint}?query=${encodeURIComponent(sparql)}`;
      console.log(`${id}`);

      try {
        const response = await axios.get(url);
        if (response.status === 200) {
          const sparqlResults = response.data.results?.bindings || [];
          const ambiguity = sparqlResults.length;
          if (ambiguity > 1) {
            console.log(`multiple results (${ambiguity})`);
          }
          const a = sparqlResults[0];

          const newAuthor: AuthorRecord = {
            name: a.authorLabel.value,
            gnd: a.gnd?.value,
            image: a.img?.value,
            birth: {
              date: a.birthDate?.value,
              place: a.birthPlaceLabel?.value,
              placeId: a.birthPlace?.value,
            },
            death: {
              date: a.deathDate?.value,
              place: a.deathPlaceLabel?.value,
              placeId: a.deathPlace?.value,
            },
          };
          if (a.gender?.value === 'http://www.wikidata.org/entity/Q6581097') {
            newAuthor.gender = 'male';
          }
          if (a.gender?.value === 'http://www.wikidata.org/entity/Q6581072') {
            newAuthor.gender = 'female';
          }
          if (ambiguity > 1) {
            newAuthor.ambiguous = true;
          }
          results[id as string] = newAuthor;
          console.log(newAuthor);
        } else {
          console.log(response.status);
        }
      } catch (error) {
        console.log(error);
      }

      console.log('waiting...');
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  writeFileSync('./src/authors.json', JSON.stringify(results, null, 2));

  // Assemble authors network
  interface Map<T> {
    [slug: string]: T;
  }
  const map: Map<OriginalPlay> = originals.reduce((acc, o) => {
    acc[o.slug as string] = o;
    return acc;
  }, {} as Map<OriginalPlay>);

  const nodes: {[id: string]: Node} = {};
  const edges: {[id: string]: Edge} = {};

  plays
    .filter((p) => p.basedOn)
    .map((p: Play) => {
      const basedOn = p.basedOn?.map((ref) => map[ref as string] || ref) || [];
      const play = {...p};
      if (basedOn.length > 0) play.basedOn = basedOn;
      return play;
    })
    .forEach((p) => {
      const originalAuthors: Author[] = [];
      p.basedOn?.forEach((o) => {
        if (typeof o !== 'string') {
          originals.push(o);
          o.authors?.forEach((a) => originalAuthors.push(a));
        }
      });

      p.authors?.forEach(({name, wikidata}) => {
        if (wikidata) {
          if (!nodes[wikidata]) {
            nodes[wikidata] = {
              name: name || '?',
              fullname: results[wikidata].name,
            };
          }
          originalAuthors.forEach((o) => {
            if (o.wikidata) {
              if (!nodes[o.wikidata]) {
                nodes[o.wikidata] = {
                  name: o.name || '?',
                  fullname: results[o.wikidata].name || name,
                };
              }
              const edgeId = `${wikidata}|${o.wikidata}`;
              if (edges[edgeId]) {
                edges[edgeId].weight++;
              } else {
                edges[edgeId] = {
                  source: wikidata,
                  target: o.wikidata,
                  weight: 1,
                };
              }
            }
          });
        }
      });
    });

  // console.log({nodes, edges});

  const date = new Date().toISOString();
  const stub = `<?xml version="1.0" encoding="UTF-8"?>
<gexf xmlns="http://gexf.net/1.2" version="1.2">
  <meta lastmodifieddate="${date}">
    <creator>einakter.dracor.org</creator>
    <description>Einakter authors network</description>
  </meta>
  <graph mode="static" defaultedgetype="directed">
    <nodes/>
    <edges/>
  </graph>
</gexf>`;

  const doc = new DOMParser().parseFromString(stub, 'text/xml');

  const nodesNode = doc.getElementsByTagName('nodes')[0];
  Object.entries(nodes).forEach(([id, node]) => {
    const elem = doc.createElement('node');
    elem.setAttribute('id', id);
    elem.setAttribute('label', node.fullname || node.name);
    nodesNode.appendChild(elem);
    const attvalue = doc.createElement('attvalue');
    attvalue.setAttribute('for', 'gender');
    attvalue.setAttribute('value', results[id].gender || '');
    elem.appendChild(doc.createElement('attvalues').appendChild(attvalue));
  });
  const edgesNode = doc.getElementsByTagName('edges')[0];
  Object.entries(edges).forEach(([id, edge]) => {
    const elem = doc.createElement('edge');
    elem.setAttribute('id', id);
    elem.setAttribute('source', edge.source);
    elem.setAttribute('target', edge.target);
    elem.setAttribute('weight', edge.weight.toString());
    edgesNode.appendChild(elem);
  });

  const gexf = new XMLSerializer().serializeToString(doc);
  writeFileSync('./public/authors-network.gexf', gexf);
}

fetchAuthors();
