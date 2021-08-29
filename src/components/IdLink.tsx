import React from 'react';

const sites = {
  dracor: {
    url: 'https://dracor.org/id/',
    title: 'DraCor.org',
  },
  wikidata: {
    url: 'https://www.wikidata.org/wiki/',
    title: 'Wikidata',
  },
  weber: {
    url: 'http://weber-gesamtausgabe.de/',
    title: 'Weber Gesamtausgabe',
  },
}

interface Props {
  id: string
  type: 'dracor' | 'weber' | 'wikidata'
  text?: string
  className?: string
};

const IdLink = ({id, type, text, className = ''}: Props) => {
  return (
    <a
      href={`${sites[type].url}${id}`}
      className={className}
      title={sites[type].title}
    >
      {text ? text : id}
    </a>
  );
};

export default IdLink;
