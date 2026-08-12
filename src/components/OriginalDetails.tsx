import {useContext} from 'react';
import {Link} from '@tanstack/react-router';
import {Route} from '../routes/originals/$slug';
import {Trans} from '@lingui/react/macro';
import {IdLink} from '@dracor/react';
import Authors from './Authors';
import DetailsHead from './DetailsHead';
import Years from './Years';
import {EinakterContext} from '../context';
import {OriginalPlay} from '../types';
import {sortByYear} from '../utils';
import {localLanguageName} from '../languages';

const OriginalDetails = () => {
  const {slug} = Route.useParams();
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
      <title>{`Einakter: ${pageTitle}`}</title>
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
                    <Link to="/$slug" params={{slug: play.slug}}>
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
                    <IdLink>{`dracor:${ids.dracor}`}</IdLink>
                  </small>
                )}{' '}
                {ids.wikidata && (
                  <small>
                    <IdLink>{`wikidata:${ids.wikidata}`}</IdLink>
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
