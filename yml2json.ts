import {loadAll, CORE_SCHEMA} from 'js-yaml';
import {readFileSync, writeFileSync} from 'fs';
import {Play, OriginalPlay} from './src/types';
import {normalizeYear, countCharacters} from './src/utils';

let data: Play[] = [];
let originals: OriginalPlay[] = [];
try {
  data = loadAll(readFileSync('./data.yaml', 'utf8'), null, {
    schema: CORE_SCHEMA
  });
  originals = loadAll(readFileSync('./originals.yaml', 'utf8'), null, {
    schema: CORE_SCHEMA
  });
} catch (error) {
  console.log(error);
}

originals.forEach(o => {
  o.normalizedYear = normalizeYear(o);
  o.authors = o.author ? [o.author] : o.authors || [];
  delete o.author;
});

interface Map<T> {
  [slug: string]: T
}
const map: Map<OriginalPlay> = originals.reduce((acc, o) => {
  acc[o.slug as string] = o;
  return acc;
}, {} as Map<OriginalPlay>);

const plays = data.map((p: Play) => {
  const normalizedYear = normalizeYear(p);
  const numberOfCharacters = countCharacters(p);
  const authors = p.author ? [p.author] : p.authors || [];
  const basedOn = p.basedOn?.map((ref) => map[ref as string] || ref) || [];
  const play = {...p, authors, normalizedYear, numberOfCharacters};
  if (basedOn.length > 0) play.basedOn = basedOn;
  return play;
});

writeFileSync('./data.json', JSON.stringify(plays));
writeFileSync('./src/originals.json', JSON.stringify(originals));
