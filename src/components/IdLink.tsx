import React from 'react';

const urlBases = {
  dracor: 'https://dracor.org/id/',
  wikidata: 'https://www.wikidata.org/wiki/',
  weber: 'http://weber-gesamtausgabe.de/',
}

interface Props {
  id: string
  type: 'dracor' | 'weber' | 'wikidata'
  text?: string
  className?: string
};

const IdLink = ({id, type, text, className = ''}: Props) => {
  return (
    <a href={`${urlBases[type]}${id}`} className={className}>
      {text ? text : id}
    </a>
  );
};

export default IdLink;
