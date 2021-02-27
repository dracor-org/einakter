import React from 'react';
import {Dict} from '../types';

type DictName =
  'bibliographia' | 'corvey' | 'dramenlexikon' | 'iffland' | 'kotzebue';

const dicts = {
  bibliographia: {
    title: 'Bibliographia dramatica et dramaticorum',
    url: 'https://www.degruyter.com/view/mvw/BDD-B'
  },
  corvey: {
    title: 'Die Dramen der Fürstlichen Bibliothek Corvey, 1805–1832',
    url: 'https://nbn-resolving.de/urn:nbn:de:bvb:12-bsb00040797-1'
  },
  dramenlexikon: {
    title: 'Dramenlexikon des 18. Jahrhunderts',
    url: 'https://de.wikipedia.org/wiki/Dramenlexikon_des_18._Jahrhunderts'
  },
  iffland: {
    title: 'Ifflands Dramen – Ein Lexikon',
    url: 'http://d-nb.info/992367107'
  },
  kotzebue: {
    title: 'Kotzebues Dramen – Ein Lexikon',
    url: 'https://de.wikipedia.org/wiki/Kotzebues_Dramen_–_Ein_Lexikon'
  },
};

interface Props {
  dictionaries: Dict[]
}

export default function Dictionaries ({dictionaries}: Props) {
  return (
    <ul>
      {dictionaries.map((d) => (
        <li key={d.name}>
          <a href={dicts[d.name as DictName].url as string}>
            {dicts[d.name as DictName].title}
          </a>
          {'. '}
          {d.url && (
            <a href={d.url}>{d.pages}</a>
          )}
          {!d.url && d.pages}
        </li>
      ))}
    </ul>
  );
}
