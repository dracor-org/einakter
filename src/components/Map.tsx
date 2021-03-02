import React from 'react';
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

console.log(locations);

const markers = Object.entries(locations).map(([k, l]) => (
  <Marker position={[l.coords[1], l.coords[0]]} key={k}>
    <SettingsPopup plays={l.plays}/>
  </Marker>
));

const SettingsMap = () => {
  return (
    <div className="settings-map">
      <h1>Settings</h1>

      <MapContainer
        center={[51.505, -0.09]}
        zoom={2}
        scrollWheelZoom={false}
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
