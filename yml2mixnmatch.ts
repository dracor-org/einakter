import {loadAll, CORE_SCHEMA} from 'js-yaml';
import {readFileSync, writeFileSync} from 'fs';
import {Play} from './src/types';

let data: Play[] = [];
try {
  data = loadAll(readFileSync('./data.yaml', 'utf8'), null, {
    schema: CORE_SCHEMA,
  }) as Play[];
} catch (error) {
  console.log(error);
}

let mixnmatch = 'id,name,q\n';

data
  .filter((p: Play) => p.ids?.wikidata)
  .forEach((p: Play) => {
    const name = p.title.replace(/"/g, '""');
    mixnmatch += `${p.id},"${name}",${p.ids?.wikidata || ''}\n`;
  });

writeFileSync('./public/mixnmatch.csv', mixnmatch);
