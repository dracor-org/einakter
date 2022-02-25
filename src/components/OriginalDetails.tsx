import React, {useContext} from 'react';
import {Link, useParams} from "react-router-dom";
import {Helmet} from "react-helmet";
import {Trans} from '@lingui/macro';
import {Table} from 'react-bootstrap';
import Authors from './Authors';
import IdCopy from './IdCopy';
import IdLink from './IdLink';
import Years from './Years';
import {EinakterContext} from '../context';
import {OriginalPlay} from '../types';
import {sortByYear} from '../utils';
import {localLanguageName} from '../languages';

const OriginalDetails = () => {
  const {slug} = useParams<{slug: string}>();
  const {plays, originals} = useContext(EinakterContext);

  const original = originals.find(o => o.slug === slug);

  if (!original) {
    return <h1><Trans>Original not found</Trans></h1>;
  }

  const translations = plays.filter(p => p.basedOn?.find(
    (o: OriginalPlay | string) => {
      if (typeof o !== 'string' && o.slug === slug) return true;
      return false;
    }
  ));

  const {
    id,
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
        <IdCopy id={id}  className="mt-1" />
      </hgroup>
      <Table>
        <tbody>
          <tr>
            <th>
              <Trans>Language</Trans>
            </th>
            <td>
              {localLanguageName(language as string)}
            </td>
          </tr>
          <tr>
            <th>
              <Trans>Translations</Trans>
            </th>
            <td>
              <ul className="list-disc text-gray-400">
                {translations.sort(sortByYear).map(play => (
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
                {ids.dracor && (
                  <small>
                    <IdLink id={ids.dracor} type="dracor"/>
                  </small>
                )}
                {' '}
                {ids.wikidata && (
                  <small>
                    <IdLink id={ids.wikidata} type="wikidata"/>
                  </small>
                )}
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
