import axios from 'axios';
import {loadAll, CORE_SCHEMA} from 'js-yaml';
import {readFileSync, writeFileSync} from 'fs';
import {Play} from './src/types';

import loc from './src/locations.json';

const locations: {[index: string]: any} = {...loc}

let data: Play[] = [];
try {
  data = loadAll(readFileSync('./data.yaml', 'utf8'), null, {
    schema: CORE_SCHEMA
  }) as Play[];
} catch (error) {
  console.log(error);
}

const locationIds = data
  // find plays with wikidata ID
  .filter((p) => p.settings?.find((s) => s.location?.wikidataId))
  // extract wikidata IDs
  .map((p) => p.settings?.filter((s) => s.location?.wikidataId).map(
    (s) => s.location?.wikidataId)
  ).flat()
  // remove duplicates
  .filter((id, index, self) => self.indexOf(id) === index);

const endpoint = 'https://query.wikidata.org/sparql';

async function fetchLocations () {
  const results: {[index: string]: any} = {};
  for(let i = 0; i < locationIds.length; i++) {
    const id = locationIds[i];
    const loc = locations[id as string];
    if (loc) {
      console.log(`${id} exists`);
      results[id as string] = loc;
    } else {
      const sparql = `SELECT ?loc WHERE { wd:${id} wdt:P625 ?loc .}`;
      const url = `${endpoint}?query=${encodeURIComponent(sparql)}`;
      console.log(`${id} ${url}`);

      try {
        const response = await axios.get(url);
        if (response.status === 200) {
          const loc = response.data.results?.bindings[0]?.loc.value;
          let long: number, lat: number;
          const m = loc.match(/\((-?[.0-9]+) (-?[.0-9]+)\)/);
          if (m) {
            long = parseFloat(m[1]);
            lat = parseFloat(m[2]);
            results[id as string] = [lat, long]
            console.log(loc, long, lat);
          }
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

  console.log(results);
  writeFileSync('./src/locations.json', JSON.stringify(results, null, 2));
}

fetchLocations();
