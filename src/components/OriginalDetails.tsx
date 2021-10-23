import React, {useContext} from 'react';
import {Link, useParams} from "react-router-dom";
import {Helmet} from "react-helmet";
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
    return <h1>Original not found</h1>;
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
    <>
      <Helmet>
        <title>Einakter: {pageTitle}</title>
      </Helmet>
      <hgroup>
        <h2>
          <Authors authors={authors}/>
        </h2>
        <h1>{title}</h1>
        {subtitle && <h3>{subtitle}</h3>}
      </hgroup>
      <Table>
        <tbody>
          <tr>
            <th>Language</th>
            <td>
              {languages[language as string] || language}
            </td>
          </tr>
          <tr>
            <th>Translations</th>
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
            <th>Dates</th>
            <td>
              <Years written={created} premiere={premiered} print={printed}/>
            </td>
          </tr>
          {ids && (
            <tr>
              <th>Links</th>
              <td>
                <ul>
                  {ids.dracor && (
                    <li>DraCor: <IdLink id={ids.dracor} type="dracor"/></li>
                  )}
                  {ids.wikidata && (
                    <li>
                     Wikidata: <IdLink id={ids.wikidata} type="wikidata"/>
                    </li>
                  )}
                </ul>
              </td>
            </tr>
          )}
          {fulltextUrl && (
            <tr>
              <th>Full text</th>
              <td>
                <a href={fulltextUrl}>
                  {fulltextUrl}
                </a>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );
};

export default OriginalDetails;
