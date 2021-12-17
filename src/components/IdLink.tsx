import React from 'react';

const sites = {
  dracor: {
    url: 'https://dracor.org/id/',
    title: 'DraCor.org',
    icon: 'DraCor.svg',
    width: 12,
  },
  wikidata: {
    url: 'https://www.wikidata.org/wiki/',
    title: 'Wikidata',
    icon: 'wikidata.svg',
    width: 16,
  },
  weber: {
    url: 'http://weber-gesamtausgabe.de/',
    title: 'Weber Gesamtausgabe',
    icon: 'weber.svg',
    width: 14,
  },
}

interface Props {
  id: string
  type: 'dracor' | 'weber' | 'wikidata'
  text?: string
  className?: string
};

const IdLink = ({id, type, text, className = ''}: Props) => {
  const site = sites[type];
  return (
    <span className="inline-flex bg-white rounded px-1.5 gap-1 align-text-bottom">
      <img src={`/${site.icon}`} width={site.width} alt=""/>
      <a
        href={`${site.url}${id}`}
        className={className}
        title={site.title}
      >
        {text ? text : id}
      </a>
    </span>
  );
};

export default IdLink;
