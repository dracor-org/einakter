import {useContext} from 'react';
import {Link, useParams} from 'react-router-dom';
import {t} from '@lingui/core/macro';
import {Trans} from '@lingui/react/macro';
import Authors from './Authors';
import IdLink from './IdLink';
import {EinakterContext} from '../context';
import {OriginalPlay} from '../types';
import {sortByYear} from '../utils';
import {localLanguageName} from '../languages';

function getYear(ref: OriginalPlay) {
  const years = [];
  if (ref.yearWritten) years.push(ref.yearWritten);
  if (ref.yearPrinted) years.push(ref.yearPrinted);
  if (ref.premiered) years.push(parseInt(ref.premiered as string));
  return years.sort()[0] || undefined;
}

interface Props {
  data: OriginalPlay;
}

const Original = ({data}: Props) => {
  const {slug: currentSlug} = useParams<{slug: string}>();
  const {plays} = useContext(EinakterContext);

  const {id, slug, authors = [], title, subtitle, ids, language} = data;

  const year = getYear(data);

  const others = plays.filter((p) =>
    p.basedOn?.find(
      (r: OriginalPlay | string) =>
        typeof r !== 'string' && r.id === id && p.slug !== currentSlug
    )
  );

  return (
    <>
      {authors.length > 0 &&
        authors.map((a, i) => (
          <span key={a.name}>
            {i > 0 && ', '}
            {a.name}
            {a.wikidata && (
              <>
                {' '}
                <small>
                  <IdLink id={a.wikidata} type="wikidata" />
                </small>
              </>
            )}
          </span>
        ))}
      {authors.length > 0 && ': '}
      <a href={`/originals/${slug}`} title={t`Originals`}>
        {title}
        {subtitle && !title.match(/[.!?]\s*$/) && '.'}
        {subtitle && ` ${subtitle}`}
      </a>
      {ids?.dracor && (
        <>
          {' '}
          <small>
            <IdLink id={ids.dracor} type="dracor" />
          </small>
        </>
      )}
      {ids?.wikidata && (
        <>
          {' '}
          <small>
            <IdLink id={ids.wikidata} type="wikidata" />
          </small>
        </>
      )}
      {year !== undefined && ` (${year})`}
      {language && ` <${localLanguageName(language)}>`}

      {others.length > 0 && (
        <>
          <p style={{margin: '.8em 0 .3em', fontStyle: 'italic'}}>
            <Trans>Other one-act translations</Trans>:
          </p>
          <ul className="list-disc text-gray-400">
            {others.sort(sortByYear).map((play) => (
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
        </>
      )}
    </>
  );
};

export default Original;
