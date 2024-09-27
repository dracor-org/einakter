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
  'yearWritten',
  'yearPrinted',
  'yearPremiered', // (without day/month for premier dates, only years)
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
  const {
    id,
    slug,
    title,
    subtitle,
    numOfScenes,
    yearWritten,
    yearPrinted,
    premiered,
    ids,
    formalia,
    keywords,
    basedOn,
  } = p;
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
  const yearPremiered = premiered ? parseInt(`${premiered}`) : undefined;
  const play: {[index: string]: string | number | undefined} = {
    id,
    link: `https://einakter.dracor.org/${slug}`,
    title,
    subtitle,
    authorName,
    authorPseudonym,
    authorWikidataID,
    basedOn: basedOn ? 'true' : 'false',
    earliestYear: getEarliestYear(p),
    yearNormalized: normalizeYear(p),
    yearWritten,
    yearPrinted,
    yearPremiered,
    formalia: formalia?.join('\n'),
    keywords: keywords?.join('\n'),
    wikidataID: ids?.wikidata
      ? `http://wikidata.org/entity/${ids.wikidata}`
      : '',
    dracorID: ids?.dracor ? `https://dracor.org/id/${ids.dracor}` : '',
    wegaId: ids?.weber ? `http://weber-gesamtausgabe.de/${ids.weber}` : '',
    locationID: locationId ? `http://wikidata.org/entity/${locationId}` : '',
    numOfScenes: numOfScenes,
    numOfCharacters: num.total,
    numOfMaleCharacters: num.male,
    numOfFemaleCharacters: num.female,
    numOfCharactersWithUnknownGender: num.unknown,
  };
  const line = cols
    .map((col) => {
      const value = play[col];
      if (value === undefined || value === '') {
        return '';
      } else if (typeof value === 'number') {
        return value;
      }
      return `"${`${value}`.replace(/"/g, '""')}"`;
    })
    .join(',');
  return line;
});

lines.unshift(cols.join(','));

writeFileSync('./data.csv', lines.join('\n'));
