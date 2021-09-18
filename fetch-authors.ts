import axios from 'axios';
import {loadAll, CORE_SCHEMA} from 'js-yaml';
import {readFileSync, writeFileSync} from 'fs';
import {Play} from './src/types';

import authorData from './src/authors.json';

interface Author {
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

const authors: {[index: string]: any} = {...authorData};

let data: Play[] = [];
try {
  data = loadAll(readFileSync('./data.yaml', 'utf8'), null, {
    schema: CORE_SCHEMA
  });
} catch (error) {
  console.log(error);
}

const plays = data.map((p: Play) => {
  const authors = p.author ? [p.author] : p.authors || [];
  const play = {...p, authors};
  return play;
});

const authorIds = plays
  .map(p => p.authors.filter(a => a.wikidata).map(a => a.wikidata))
  .flat()
  .filter((id, index, self) => self.indexOf(id) === index);

const endpoint = 'https://query.wikidata.org/sparql';

async function fetchAuthors () {
  const results: {[index: string]: any} = {};
  for(let i = 0; i < authorIds.length; i++) {
    const id = authorIds[i];
    const author = authors[id as string];
    if (author) {
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
          let ambiguity = sparqlResults.length;
          if (ambiguity > 1) {
            console.log(`multiple results (${ambiguity})`);
          }
          const a = sparqlResults[0];

          const newAuthor: Author = {
            name: a.authorLabel.value,
            gnd: a.gnd?.value,
            image: a.img?.value,
            birth: {
              date: a.birthDate?.value,
              place: a.birthPlaceLabel?.value,
              placeId: a.birthPlace?.value
            },
            death: {
              date: a.deathDate?.value,
              place: a.deathPlaceLabel?.value,
              placeId: a.deathPlace?.value
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
        console.log(error)
      }

      console.log('waiting...');
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  writeFileSync('./src/authors.json', JSON.stringify(results, null, 2));
}

fetchAuthors();
