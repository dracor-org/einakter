import {loadAll, CORE_SCHEMA} from 'js-yaml';
import {readFileSync, writeFileSync} from 'fs';
import {Play} from './src/types';

let data: Play[] = [];
try {
  data = loadAll(readFileSync('./data.yaml', 'utf8'), null, {
    schema: CORE_SCHEMA
  });
} catch (error) {
  console.log(error);
}

let beacon = `#FORMAT: BEACON
#PREFIX: http://www.wikidata.org/entity/
#TARGET: https://einakter.dracor.org/
#NAME: Einakter Datenbank
#FEED: https://einakter.dracor.org/wikidata.txt

`;

data.filter((p: Play) => p.ids?.wikidata).forEach((p: Play) => {
  beacon += `${p.ids?.wikidata}||${p.slug}\n`;
});

writeFileSync('./public/wikidata.txt', beacon);
