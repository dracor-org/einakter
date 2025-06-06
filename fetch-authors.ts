import axios from 'axios';
import {loadAll, CORE_SCHEMA} from 'js-yaml';
import {readFileSync, writeFileSync} from 'fs';
import builder from 'xmlbuilder';
import {Author, AuthorData, AuthorMap, OriginalPlay, Play} from './src/types';

import authorData from './src/authors.json';

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

const authors: AuthorMap = {...authorData};

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

const translatedAuthorIds = originals
  .map((o) => o.authors?.filter((a) => a.wikidata).map((a) => a.wikidata))
  .flat();
const translatorIds = plays
  .map((p) => p.authors?.filter((a) => a.wikidata).map((a) => a.wikidata))
  .flat();

const authorIds = translatorIds
  .concat(translatedAuthorIds)
  .filter((id, index, self) => self.indexOf(id) === index);

const endpoint = 'https://query.wikidata.org/sparql';

async function fetchAuthors() {
  const results: AuthorMap = {};
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

          const newAuthor: AuthorData = {
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

  const root = builder.create('gexf', {encoding: 'UTF-8'});
  root.att('xmlns', 'http://gexf.net/1.2');
  root.att('version', '1.2');
  const meta = root.ele('meta', {lastmodifieddate: new Date().toISOString()});
  meta.ele('creator', {}, 'einakter.dracor.org');
  meta.ele('description', {}, 'Einakter translators network');

  const graphNode = root.ele('graph', {
    mode: 'static',
    defaultedgetype: 'directed',
  });

  const attributesNode = graphNode.ele('attributes', {
    class: 'node',
    mode: 'static',
  });
  attributesNode.ele('attribute', {
    id: 'gender',
    title: 'Gender',
    type: 'string',
  });
  attributesNode.ele('attribute', {
    id: 'translator',
    title: 'Translator',
    type: 'boolean',
  });
  attributesNode.ele('attribute', {
    id: 'translated-author',
    title: 'Translated author',
    type: 'boolean',
  });

  const nodesElem = graphNode.ele('nodes');
  Object.entries(nodes).forEach(([id, node]) => {
    const elem = nodesElem
      .ele('node', {id, label: node.fullname || node.name})
      .ele('attvalues');
    elem.ele('attvalue', {for: 'gender', value: results[id].gender || ''});
    const isTranslator = translatorIds.indexOf(id) >= 0 ? 'true' : 'false';
    elem.ele('attvalue', {for: 'translator', value: isTranslator});
    const isTranslated =
      translatedAuthorIds.indexOf(id) >= 0 ? 'true' : 'false';
    elem.ele('attvalue', {for: 'translated-author', value: isTranslated});
  });

  const edgesElem = graphNode.ele('edges');
  Object.entries(edges).forEach(([id, {source, target, weight}]) => {
    edgesElem.ele('edge', {
      id,
      source,
      target,
      weight: weight.toString(),
    });
  });

  const gexf = root.end({pretty: true});
  writeFileSync('./public/translators-network.gexf', gexf);
}

fetchAuthors();
