import React from 'react';
import {Link} from 'react-router-dom';
import {Popup} from 'react-leaflet';
import {Author} from '../types';

function renderAuthors (authors: Author[]) {
  return authors.map((author, i) => (
    <span key={`author-${i}-${author.name}`}>
      {i > 0 && ' · '}
      {author.name}
      {author.pseudonym && (<i> ({author.pseudonym})</i>)}
    </span>
  ));
}

export interface SettingInfo {
  authors: Author[],
  title: string,
  slug: string,
  year?: number,
  setting: string,
}

interface Props {
  settings: SettingInfo[]
}

const SettingsPopup = ({settings}: Props) => {
  return (
    <Popup>
      <div className="max-h-52 overflow-scroll" >
      {settings.map((s) => (
        <div className="mb-4" key={s.slug}>
          <div className="mb-1">
            {s.authors && renderAuthors(s.authors)}
            {s.authors && ', '}
            <Link to={`/${s.slug}`}>{s.title}</Link>
            {'. '}
            {s.year}
          </div>
          <div><em>{s.setting}</em></div>
        </div>
      ))}
      </div>
    </Popup>
  );
};

export default SettingsPopup;
