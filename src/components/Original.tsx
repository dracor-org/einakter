import React, {useContext} from 'react';
import {Link, useParams} from "react-router-dom";
import IdLink from './IdLink';
import {EinakterContext} from '../context';
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
  const {id: currentId} = useParams<{id: string}>();
  const {plays} = useContext(EinakterContext);

  const {
    id,
    author,
    title,
    subtitle,
    ids,
    fulltextUrl,
    language,
  } = data;

  const year = getYear(data);

  const others = plays.filter((p) => p.basedOn?.find(
    (r: OriginalPlay) => r.id === id && p.slug !== currentId
  ));
  
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

      {others.length > 0 && (
        <>
          <p style={{margin: '.8em 0 .3em', fontStyle: 'italic'}}>
            Other one-act translations:
          </p>
          <ul>
            {others.map((play) => (
              <li key={play.slug}>
                <Link to={`/${play.slug}`}>
                  {play.author?.name && `${play.author.name}: `}
                  {play.title}
                  {play.subtitle && `. ${play.subtitle}`}
                  {play.normalizedYear && ` (${play.normalizedYear})`}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};

export default Original;
