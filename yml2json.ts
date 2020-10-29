import {safeLoadAll, CORE_SCHEMA} from 'js-yaml';
import {readFileSync, writeFileSync} from 'fs';
import {Play} from './src/types';
import {normalizeYear, countCharacters} from './src/utils';

let data: Play[] = [];
try {
  data = safeLoadAll(readFileSync('./data.yaml', 'utf8'), null, {
    schema: CORE_SCHEMA
  });
} catch (error) {
  console.log(error);
}

const plays = data.map((p: Play) => {
  const normalizedYear = normalizeYear(p);
  const numberOfCharacters = countCharacters(p);
  const authors = p.author ? [p.author] : p.authors || [];
  return {...p, authors, normalizedYear, numberOfCharacters}
});

writeFileSync('./data.json', JSON.stringify(plays));
