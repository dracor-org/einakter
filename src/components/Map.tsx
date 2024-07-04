import {useContext} from 'react';
import {Helmet} from 'react-helmet-async';
import {Trans, t} from '@lingui/macro';
import {MapContainer, TileLayer, Marker} from 'react-leaflet';
import {EinakterContext} from '../context';
import SettingsPopup from './SettingsPopup';
import {SettingInfo} from '../types';
import {LatLngTuple} from 'leaflet';

import coords from '../locations.json';

interface Location {
  coords: LatLngTuple;
  settings: SettingInfo[];
}

const loc: {[index: string]: number[]} = {...coords};

const SettingsMap = () => {
  const {plays} = useContext(EinakterContext);

  const locations: {[index: string]: Location} = {};

  plays.forEach((p) => {
    p.settings
      ?.filter((s) => s.location?.wikidataId)
      .forEach((s) => {
        const id = s.location?.wikidataId;
        if (id) {
          if (!locations[id]) {
            locations[id] = {
              coords: loc[id] as LatLngTuple,
              settings: [],
            };
          }
          locations[id].settings.push({
            authors: p.authors || [],
            title: p.title,
            slug: p.slug,
            year: p.yearNormalized,
            setting: s.description,
          });
        }
      });
  });

  const markers = Object.entries(locations).map(([k, l]) => (
    <Marker position={l.coords} key={k}>
      <SettingsPopup settings={l.settings} />
    </Marker>
  ));

  return (
    <div className="locations-map p-4">
      <Helmet>
        <title>Einakter: {t`Locations`}</title>
      </Helmet>

      <p className="mb-4">
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
        className="z-0"
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
