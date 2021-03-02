import React from 'react';
import {Link} from 'react-router-dom';
import {Popup} from 'react-leaflet';
import {Author, Play} from '../types';

function renderAuthors (authors: Author[]) {
  return authors.map((author, i) => (
    <span key={`author-${i}-${author.name}`}>
      {i > 0 && ' · '}
      {author.name}
      {author.pseudonym && (<i> ({author.pseudonym})</i>)}
    </span>
  ));
}

interface Props {
  plays: Play[]
}

const SettingsPopup = ({plays}: Props) => {
  return (
    <Popup>
      {plays.map((p) => (
        <div className="popup-setting" key={p.slug}>
          <p>
            {p.authors && renderAuthors(p.authors)}
            {p.authors && ', '}
            <Link to={`/${p.slug}`}>{p.title}</Link>
            {'. '}
            {p.normalizedYear}
          </p>
          <p><em>{p.setting}</em></p>
        </div>
      ))}
    </Popup>
  );
};

export default SettingsPopup;
