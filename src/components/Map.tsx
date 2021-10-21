import React from 'react';
import {Helmet} from "react-helmet";
import {Trans, t} from '@lingui/macro';
import {MapContainer, TileLayer, Marker} from 'react-leaflet';
import SettingsPopup from './SettingsPopup';

import data from '../data.json';
import coords from '../locations.json';

const loc: {[index: string]: any} = {...coords};

const locations: {[index: string]: any} = {};

data.forEach((p) => {
  const id = p.location?.wikidataId;
  if (id) {
    if (!locations[id]) {
      locations[id] = {
        coords: loc[id],
        plays: []
      };
    }
    locations[id].plays.push(p);
  }
});

const markers = Object.entries(locations).map(([k, l]) => (
  <Marker position={l.coords} key={k}>
    <SettingsPopup plays={l.plays}/>
  </Marker>
));

const SettingsMap = () => {
  return (
    <div className="locations-map p-4">
      <Helmet>
        <title>Einakter: {t`Locations`}</title>
      </Helmet>

      <h1><Trans>Locations</Trans></h1>

      <p>
        <Trans>
          This map shows all plot locations extractable from the setting
          information at the beginning of a play. Denominations and demarcations
          on the map are provided by OpenStreetMap and are therefore ahistorical
          in relation to the time of action and creation of a play.
        </Trans>
      </p>

      <MapContainer
        center={[51.505, -0.09]}
        zoom={2}
        scrollWheelZoom={false}
        tap={false}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers}
      </MapContainer>
    </div>
  );
};

export default SettingsMap;
