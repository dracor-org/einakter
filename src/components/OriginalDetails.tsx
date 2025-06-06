import {useContext} from 'react';
import {Link, useParams} from 'react-router-dom';
import {Helmet} from 'react-helmet-async';
import {Trans} from '@lingui/react/macro';
import Authors from './Authors';
import DetailsHead from './DetailsHead';
import IdLink from './IdLink';
import Years from './Years';
import {EinakterContext} from '../context';
import {OriginalPlay} from '../types';
import {sortByYear} from '../utils';
import {localLanguageName} from '../languages';

const OriginalDetails = () => {
  const {slug} = useParams<{slug: string}>();
  const {plays, originals} = useContext(EinakterContext);

  const original = originals.find((o) => o.slug === slug);

  if (!original) {
    return (
      <h1>
        <Trans>Original not found</Trans>
      </h1>
    );
  }

  const translations = plays.filter((p) =>
    p.basedOn?.find((o: OriginalPlay | string) => {
      if (typeof o !== 'string' && o.slug === slug) return true;
      return false;
    })
  );

  const {
    id,
    authors = [],
    title,
    subtitle,
    ids,
    yearWritten,
    premiered,
    yearPrinted,
    fulltextUrl,
    language,
  } = original;

  const authorNames = authors.map((a) => a.name || '').join(' · ');
  const pageTitle = authorNames ? `${authorNames}: ${title}` : title;

  return (
    <div className="p-4 flex flex-col">
      <Helmet>
        <title>Einakter: {pageTitle}</title>
      </Helmet>
      <DetailsHead
        id={id}
        authors={authors}
        title={title}
        subtitle={subtitle}
      />
      <table>
        <tbody>
          <tr>
            <th>
              <Trans>Language</Trans>
            </th>
            <td>{localLanguageName(language as string)}</td>
          </tr>
          <tr>
            <th>
              <Trans>Translations</Trans>
            </th>
            <td>
              <ul className="list-disc text-gray-400">
                {translations.sort(sortByYear).map((play) => (
                  <li key={play.slug}>
                    <Link to={`/${play.slug}`}>
                      {play.authors && play.authors.length > 0 && (
                        <>
                          <Authors authors={play.authors} />
                          {': '}
                        </>
                      )}
                      {play.title}
                      {play.subtitle && !play.title.match(/[.!?]\s*$/) && '.'}
                      {play.subtitle && ` ${play.subtitle}`}
                      {play.yearNormalized && ` (${play.yearNormalized})`}
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
              <Years
                written={yearWritten}
                premiere={premiered}
                print={yearPrinted}
              />
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
                    <IdLink id={ids.dracor} type="dracor" />
                  </small>
                )}{' '}
                {ids.wikidata && (
                  <small>
                    <IdLink id={ids.wikidata} type="wikidata" />
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
                <a href={fulltextUrl}>{fulltextUrl}</a>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OriginalDetails;
