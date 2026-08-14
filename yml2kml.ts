import {loadAll, CORE_SCHEMA} from 'js-yaml';
import {readFileSync, writeFileSync} from 'fs';
import xmlbuilder from 'xmlbuilder';
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

const doc = xmlbuilder
  .create('kml', {encoding: 'UTF-8'})
  .att('xmlns', 'http://www.opengis.net/kml/2.2')
  .ele('Document')
  .ele('name', {}, 'Einakter locations')
  .up();

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
  const year = normalizeYear(p);

  const url = `https://einakter.dracor.org/id/${p.id}`;
  const description = `<p>${setting.description}</p><a href="${url}" title="${p.id}">${name} (${year})</a>`;

  const placemark = doc.ele('Placemark');
  placemark.ele('name', {}, name);
  placemark.ele('address', {}, setting.description);
  placemark.ele('description').cdata(description);
  placemark.ele('Point').ele('coordinates', {}, `${lng},${lat},0`);
  if (year) {
    placemark.ele('TimeStamp').ele('when', {}, `${year}`);
  }
});

writeFileSync('./public/locations.kml', doc.end({pretty: true}));
