import {loadAll, CORE_SCHEMA} from 'js-yaml';
import {readFileSync, writeFileSync} from 'fs';
import {Play} from './src/types';
import {
  normalizeYear,
  getEarliestYear,
  countCharactersByGender,
} from './src/utils';

const separator = '|';

let data: Play[] = [];
try {
  data = loadAll(readFileSync('./data.yaml', 'utf8'), null, {
    schema: CORE_SCHEMA,
  }) as Play[];
} catch (error) {
  console.log(error);
}

const cols = [
  'id',
  'link', // (the slug, but as clickable link for convenience)
  'title',
  'subtitle',
  'authorName',
  'authorPseudonym',
  'authorWikidataID',
  'basedOn', // (only true or false, an easy way to exclude translations)
  'earliestYear',
  'yearNormalized',
  'createdYear',
  'printedYear',
  'premiereYear', // (without day/month for premier dates, only years)
  'formalia', // (in one cell, separated by a line break)
  'keywords', // (in one cell, separated by a line break)
  'wikidataID', // (as full URL to be clickable for convenience)
  'dracorID', // (as full URL to be clickable for convenience)
  'wegaId',
  'locationID', // (as full URL to be clickable for convenience)
  'numOfScenes',
  'numOfCharacters',
  'numOfMaleCharacters',
  'numOfFemaleCharacters',
  'numOfCharactersWithUnknownGender',
];

const lines = data.map((p: Play) => {
  const authors = p.authors || [p.author];
  const authorName = authors.map((a) => a?.name || '').join(separator);
  const authorPseudonym = authors
    .map((a) => a?.pseudonym || '')
    .join(separator);
  const authorWikidataID = authors
    .map((a) => a?.wikidata || '')
    .join(separator);
  const num = countCharactersByGender(p);
  const locationId = p.settings?.find((s) => s.location?.wikidataId)?.location
    .wikidataId;
  const play: {[index: string]: any} = {
    ...p,
    authorName,
    authorPseudonym,
    authorWikidataID,
    yearNormalized: normalizeYear(p),
    earliestYear: getEarliestYear(p) || '',
    numOfCharacters: num.total,
    numOfMaleCharacters: num.male,
    numOfFemaleCharacters: num.female,
    numOfCharactersWithUnknownGender: num.unknown,
    basedOn: p.basedOn ? 'true' : 'false',
    link: `https://einakter.dracor.org/${p.slug}`,
    yearWritten: p.yearWritten,
    yearPrinted: p.yearPrinted,
    yearPremiered: p.premiered ? `${p.premiered}`.split('-')[0] : '',
    formalia: p.formalia?.join('\n'),
    keywords: p.keywords?.join('\n'),
    dracorID: p.ids?.dracor ? `https://dracor.org/id/${p.ids.dracor}` : '',
    wegaId: p.ids?.weber ? `http://weber-gesamtausgabe.de/${p.ids.weber}` : '',
    wikidataID: p.ids?.wikidata
      ? `http://wikidata.org/entity/${p.ids.wikidata}`
      : '',
    locationID: locationId ? `http://wikidata.org/entity/${locationId}` : '',
  };
  const line = cols
    .map((col) => {
      const value: string = play[col] || '';
      return `"${`${value}`.replace(/"/g, '""')}"`;
    })
    .join(',');
  return line;
});

lines.unshift(cols.join(','));

writeFileSync('./data.csv', lines.join('\n'));
