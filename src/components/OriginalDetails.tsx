import React, {useContext} from 'react';
import {Link, useParams} from "react-router-dom";
import {Helmet} from "react-helmet";
import {Trans} from '@lingui/macro';
import {Table} from 'react-bootstrap';
import Authors from './Authors';
import IdLink from './IdLink';
import Years from './Years';
import {EinakterContext} from '../context';
import {OriginalPlay} from '../types';
import {languages} from '../utils';

const OriginalDetails = () => {
  const {originalId} = useParams<{originalId: string}>();
  const {plays, originals} = useContext(EinakterContext);

  const original = originals.find(o => o.id === originalId);

  if (!original) {
    return <h1><Trans>Original not found</Trans></h1>;
  }

  const translations = plays.filter(p => p.basedOn?.find(
    (o: OriginalPlay | string) => {
      if (typeof o !== 'string' && o.id === originalId) return true;
      return false;
    }
  ));

  const {
    authors = [],
    title,
    subtitle,
    ids,
    created,
    premiered,
    printed,
    fulltextUrl,
    language,
  } = original;

  const authorNames = authors.map(a => a.name || '').join(' · ');
  const pageTitle = authorNames ? `${authorNames}: ${title}` : title;

  return (
    <div className="p-4 flex flex-col">
      <Helmet>
        <title>Einakter: {pageTitle}</title>
      </Helmet>
      <hgroup className='mb-4'>
        <h2>
          <Authors authors={authors}/>
        </h2>
        <h1>{title}</h1>
        {subtitle && <h3>{subtitle}</h3>}
      </hgroup>
      <Table>
        <tbody>
          <tr>
            <th>
              <Trans>Language</Trans>
            </th>
            <td>
              {languages[language as string] || language}
            </td>
          </tr>
          <tr>
            <th>
              <Trans>Translations</Trans>
            </th>
            <td>
              <ul>
                {translations.map(play => (
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
            </td>
          </tr>
          <tr className="dates">
            <th>
              <Trans>Dates</Trans>
            </th>
            <td>
              <Years written={created} premiere={premiered} print={printed}/>
            </td>
          </tr>
          {ids && (
            <tr>
              <th>
                <Trans>Links</Trans>
              </th>
              <td>
                <ul>
                  {ids.dracor && (
                    <li>
                      <small>
                        <IdLink id={ids.dracor} type="dracor"/>
                      </small>
                    </li>
                  )}
                  {ids.wikidata && (
                    <li>
                      <small>
                        <IdLink id={ids.wikidata} type="wikidata"/>
                      </small>
                    </li>
                  )}
                </ul>
              </td>
            </tr>
          )}
          {fulltextUrl && (
            <tr>
              <th>
                <Trans>Full text</Trans>
              </th>
              <td>
                <a href={fulltextUrl}>
                  {fulltextUrl}
                </a>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default OriginalDetails;
