import React from 'react';
import IdLink from './IdLink';
import {OriginalPlay} from '../types';

function getYear(ref: OriginalPlay) {
  const years = [];
  if (ref.created) years.push(ref.created);
  if (ref.printed) years.push(ref.printed);
  if (ref.premiered) years.push(parseInt(ref.premiered as string));
  return years.sort()[0] || undefined;
}

const languages: any = {
  eng: 'English',
  fre: 'French',
  ger: 'German',
  ita: 'Italian',
  rus: 'Russian',
  spa: 'Spanish',
}

interface Props {
  data: OriginalPlay
};

const Original = ({data}: Props) => {
  const {
    author,
    title,
    subtitle,
    ids,
    fulltextUrl,
    language,
  } = data;

  const year = getYear(data);

  return (
    <>
      {author?.name}
      {author?.wikidata && (
        <>
          {' '}
          <IdLink id={author.wikidata} type="wikidata"/>
        </>
      )}
      {author && ': '}
      {fulltextUrl ? (
        <a href={fulltextUrl} title="Full text">
         {title}
         {subtitle && `. ${subtitle}`}
        </a>
      ) : (
        <span>
          {title}
          {subtitle && `. ${subtitle}`}
        </span>
      )}
      {ids?.dracor && (
        <>
          {' ['}
          <IdLink id={ids.dracor} type="dracor"/>
          {']'}
        </>
      )}
      {ids?.wikidata && (
        <>
          {' ['}
          <IdLink id={ids.wikidata} type="wikidata"/>
          {']'}
        </>
      )}
      {year !== undefined && ` (${year})`}
      {language && ` <${languages[language] || language}>`}
    </>
  );
};

export default Original;
