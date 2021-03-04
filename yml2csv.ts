import {loadAll, CORE_SCHEMA} from 'js-yaml';
import {readFileSync, writeFileSync} from 'fs';
import {Play} from './src/types';
import {normalizeYear, countCharactersByGender} from './src/utils';

let data: Play[] = [];
try {
  data = loadAll(readFileSync('./data.yaml', 'utf8'), null, {
    schema: CORE_SCHEMA
  });
} catch (error) {
  console.log(error);
}

const cols = [
  'link', // (the slug, but as clickable link for convenience)
  'title',
  'subtitle',
  'basedOn', // (only true or false, an easy way to exclude translations)
  'normalizedYear',
  'createdYear',
  'printedYear',
  'premiereYear', // (without day/month for premier dates, only years)
  'formalia', // (in one cell, separated by a line break)
  'keywords', // (in one cell, separated by a line break)
  'wikidataID', // (as full URL to be clickable for convenience)
  'dracorID', // (as full URL to be clickable for convenience)
  'numberOfScenes',
  'numberOfCharacters',
  'numberOfMaleCharacters',
  'numberOfFemaleCharacters',
  'numberOfCharactersWithUnknownGender'
];

const lines = data.map((p: Play) => {
  const num = countCharactersByGender(p);
  const play: {[index: string]: any} = {
    ...p,
    normalizedYear: normalizeYear(p),
    numberOfCharacters: num.total,
    numberOfMaleCharacters: num.male,
    numberOfFemaleCharacters: num.female,
    numberOfCharactersWithUnknownGender: num.unknown,
    basedOn: p.basedOn ? 'true' : 'false',
    link: `https://einakter.dracor.org/${p.slug}`,
    createdYear: p.created,
    printedYear: p.printed,
    premiereYear: p.premiered ? `${p.premiered}`.split('-')[0] : '',
    formalia: p.formalia?.join('\n'),
    keywords: p.keywords?.join('\n'),
    dracorId: p.ids?.dracor ? `https://dracor.org/id/${p.ids.dracor}` : '',
    wikidataId: p.ids?.wikidata
      ? `https://www.wikidata.org/wiki/${p.ids.wikidata}` : ''
  };
  const line = cols.map(col => {
    const value: string = play[col] || '';
    return `"${`${value}`.replace(/"/g, '""')}"`;
  }).join(',');
  return line;
});

lines.unshift(cols.join(','));

writeFileSync('./data.csv', lines.join('\n'));
