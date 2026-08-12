import {loadAll, CORE_SCHEMA} from 'js-yaml';
import {readFileSync, writeFileSync} from 'fs';
import {Play} from './src/types';
import {normalizeYear} from './src/utils';
import locations from './src/locations.json';

const coords: {[id: string]: number[]} = {...locations};

let data: Play[] = [];
try {
  data = loadAll(readFileSync('./data.yaml', 'utf8'), null, {
    schema: CORE_SCHEMA,
  }) as Play[];
} catch (error) {
  console.log(error);
}

const cols = [
  'Name',
  'Address',
  'Description',
  'Longitude',
  'Latitude',
  'TimeStamp',
];

const quote = (value: string | number | undefined): string => {
  if (value === undefined || value === '') return '';
  if (typeof value === 'number') return `${value}`;
  return `"${value.replace(/"/g, '""')}"`;
};

const lines: string[] = [cols.join(',')];

data.forEach((p: Play) => {
  const setting = p.settings?.find(
    (s) => s.location?.wikidataId && coords[s.location.wikidataId]
  );
  if (!setting) return;

  const wikidataId = setting.location.wikidataId as string;
  const [lat, lng] = coords[wikidataId];
  const authors = p.authors || (p.author ? [p.author] : []);
  const authorName = authors
    .map((a) => a?.name)
    .filter(Boolean)
    .join(' / ');
  const name = authorName ? `${authorName}: ${p.title}` : p.title;

  const row = [
    quote(name),
    quote(setting.description),
    quote(`https://einakter.dracor.org/id/${p.id}`),
    quote(lng),
    quote(lat),
    quote(normalizeYear(p)),
  ];
  lines.push(row.join(','));
});

writeFileSync('./public/locations.csv', lines.join('\n'));
