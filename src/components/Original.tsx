import React, {useContext} from 'react';
import {Link, useParams} from "react-router-dom";
import {Trans} from '@lingui/macro';
import Authors from './Authors';
import IdLink from './IdLink';
import {EinakterContext} from '../context';
import {OriginalPlay} from '../types';
import languages from '../languages';

function getYear(ref: OriginalPlay) {
  const years = [];
  if (ref.created) years.push(ref.created);
  if (ref.printed) years.push(ref.printed);
  if (ref.premiered) years.push(parseInt(ref.premiered as string));
  return years.sort()[0] || undefined;
}

interface Props {
  data: OriginalPlay
};

const Original = ({data}: Props) => {
  const {id: currentId} = useParams<{id: string}>();
  const {plays} = useContext(EinakterContext);

  const {
    id,
    authors = [],
    title,
    subtitle,
    ids,
    fulltextUrl,
    language,
  } = data;

  const year = getYear(data);

  const others = plays.filter((p) => p.basedOn?.find(
    (r: OriginalPlay | string) => 
      typeof r !== 'string' && r.id === id && p.slug !== currentId
  ));

  return (
    <>
      {authors.length > 0 && authors.map((a, i) => (
        <span key={a.name}>
          {i > 0 && ', '}
          {a.name}
          {a.wikidata && (
            <>
              {' '}
              <small><IdLink id={a.wikidata} type="wikidata"/></small>
            </>
          )}
        </span>
      ))}
      {authors.length > 0 && ': '}
      {fulltextUrl ? (
        <a href={fulltextUrl} title="Full text">
         {title}
         {(subtitle && !title.match(/[.!?]\s*$/)) && '.'}
         {subtitle && ` ${subtitle}`}
        </a>
      ) : (
        <span>
          {title}
          {subtitle && `. ${subtitle}`}
        </span>
      )}
      {ids?.dracor && (
        <>
          {' '}
          <small><IdLink id={ids.dracor} type="dracor"/></small>
        </>
      )}
      {ids?.wikidata && (
        <>
          {' '}
          <small><IdLink id={ids.wikidata} type="wikidata"/></small>
        </>
      )}
      {year !== undefined && ` (${year})`}
      {language && ` <${languages[language] || language}>`}

      {others.length > 0 && (
        <>
          <p style={{margin: '.8em 0 .3em', fontStyle: 'italic'}}>
            <Trans>Other one-act translations</Trans>:
          </p>
          <ul>
            {others.map((play) => (
              <li key={play.slug}>
                <Link to={`/${play.slug}`}>
                  {(play.authors && play.authors.length > 0) && (
                    <>
                      <Authors authors={play.authors}/>{': '}
                    </>
                  )}
                  {play.title}
                  {(play.subtitle && !play.title.match(/[.!?]\s*$/)) && '.'}
                  {play.subtitle && ` ${play.subtitle}`}
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
