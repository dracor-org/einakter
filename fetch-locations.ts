import axios from 'axios';
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

const locationIds = data
  .filter((p) => p.location?.wikidataId)
  .map((p) => p.location?.wikidataId)
  .filter((id, index, self) => self.indexOf(id) === index);

const endpoint = 'https://query.wikidata.org/sparql';

async function fetchLocations () {
  const results: {[index: string]: any} = {};

  for(let i = 0; i < locationIds.length; i++) {
    const id = locationIds[i];
    const sparql = `SELECT ?loc WHERE { wd:${id} wdt:P625 ?loc .}`;
    const url = `${endpoint}?query=${encodeURIComponent(sparql)}`;
    console.log(`${id} ${url}`);

    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        const loc = response.data.results?.bindings[0]?.loc.value;
        let long, lat;
        const m = loc.match(/\((-?[.0-9]+) (-?[.0-9]+)\)/);
        if (m) {
          long = parseFloat(m[1]);
          lat = parseFloat(m[2]);
          results[id as string] = [long, lat]
        }
        console.log(loc, long, lat);
      } else {
        console.log(response.status);
      }
    } catch (error) {
      console.log(error)
    }
    
    console.log('waiting...');
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log(results);
  writeFileSync('./src/locations.json', JSON.stringify(results, null, 2));
}

fetchLocations();
