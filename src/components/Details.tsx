import {useEffect, useContext} from 'react';
import {useLocation, useParams} from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import {Helmet} from 'react-helmet-async';
import {Trans, t} from '@lingui/macro';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Authors from './Authors';
import AuthorInfo from './AuthorInfo';
import Dictionaries from './Dictionaries';
import Years from './Years';
import GenderIcon from './GenderIcon';
import IdLink from './IdLink';
import IdCopy from './IdCopy';
import BasedOn from './BasedOn';
import {EinakterContext} from '../context';
import {CastMember, Play} from '../types';

export default function Details() {
  const {slug} = useParams<{slug: string}>();
  const {pathname} = useLocation();
  const {plays: data} = useContext(EinakterContext);

  const groupIcon = <FontAwesomeIcon icon="users" size="sm" title={t`Group`} />;

  const play: Play | undefined = data.find((p: Play) => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (!play) {
    return (
      <strong>
        <Trans>No such play</Trans>
      </strong>
    );
  }

  const {
    id,
    title,
    subtitle,
    authors = [],
    cast,
    comments,
    yearWritten,
    yearPrinted,
    dictionaries,
    editions,
    formalia,
    ids,
    keywords,
    numOfScenes,
    premiered,
    reviews,
    settings,
    basedOn,
  } = play;

  const authorNames = authors
    .map((a) => a.pseudonym || a.name || '')
    .join(' · ');
  const pageTitle = authorNames ? `${authorNames}: ${title}` : title;

  return (
    <div className="p-4 flex flex-col">
      <Helmet>
        <title>Einakter: {pageTitle}</title>
      </Helmet>
      <div className="flex justify-between mb-4 flex-col gap-3 md:flex-row">
        <div>
          <hgroup>
            <h2>
              <Authors authors={authors} />
            </h2>
            <h1>{title}</h1>
            {subtitle && <h3>{subtitle}</h3>}
            <IdCopy id={id} className="mt-1" />
          </hgroup>
        </div>
        <div>
          {authors
            .filter((a) => Boolean(a.wikidata))
            .map((a) => (
              <AuthorInfo
                key={a.wikidata}
                fullname={a.name || ''}
                wikidataId={a.wikidata || ''}
              />
            ))}
        </div>
      </div>
      <table>
        <tbody>
          {comments && (
            <tr>
              <th>
                <Trans>Comments</Trans>
              </th>
              <td>
                <ul className="list-disc text-gray-400">
                  {comments.map((c, i) => (
                    <li key={`comment-${i}`}>
                      <ReactMarkdown className="text-black">{c}</ReactMarkdown>
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          )}
          {reviews && (
            <tr>
              <th>
                <Trans>Reviews</Trans>
              </th>
              <td>
                <ul className="list-disc text-gray-400">
                  {reviews.map((r, i) => (
                    <li key={`review-${i}`}>
                      <ReactMarkdown className="text-black">{r}</ReactMarkdown>
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          )}
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
          {numOfScenes && (
            <tr>
              <th>
                <Trans>Number of Scenes</Trans>
              </th>
              <td>{numOfScenes}</td>
            </tr>
          )}
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
                )}{' '}
                {ids.weber && (
                  <small>
                    <IdLink id={ids.weber} type="weber" />
                  </small>
                )}
              </td>
            </tr>
          )}
          {editions && (
            <tr>
              <th>
                <Trans>Editions</Trans>
              </th>
              <td>
                <ul className="list-disc text-gray-400">
                  {editions.map((e) => (
                    <li key={e.url || e.title}>
                      {e.url ? (
                        <a href={e.url}>{e.title}</a>
                      ) : (
                        <span className="text-black">{e.title}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          )}
          {cast && (
            <tr>
              <th>
                <Trans>Dramatis personae</Trans>
              </th>
              <td>
                <ul>
                  {cast.map((c: CastMember) =>
                    c.group ? (
                      <li
                        className="flex flex-row-reverse justify-end mb-2"
                        key={c.role}
                      >
                        <em
                          className="self-center
                                    flex
                                    items-center
                                    ml-5
                                    before:bg-black
                                    before:block
                                    before:h-[2px]
                                    before:w-2.5
                                    before:mr-2"
                        >
                          {c.role}
                        </em>
                        <ul
                          className="relative
                                    after:w-3
                                    after:h-calc-full-0.75
                                    after:rounded-r
                                    after:border-solid
                                    after:border-black
                                    after:border-r-2
                                    after:border-t-2
                                    after:border-b-2
                                    after:absolute
                                    after:top-1.5
                                    after:-right-5"
                        >
                          {c.group &&
                            c.group.map((member) => (
                              <li key={member.name}>
                                {member.name}
                                {member.role && <i> {member.role}</i>}{' '}
                                {member.gender && (
                                  <GenderIcon gender={member.gender} />
                                )}{' '}
                                {member.isGroup && groupIcon}
                              </li>
                            ))}
                        </ul>
                      </li>
                    ) : (
                      <li className="mb-2" key={c.name}>
                        {c.name}
                        {c.role && <i> {c.role}</i>}{' '}
                        {c.gender && <GenderIcon gender={c.gender} />}{' '}
                        {c.isGroup && groupIcon}
                      </li>
                    )
                  )}
                </ul>
              </td>
            </tr>
          )}
          {settings?.length && (
            <tr>
              <th>
                <Trans>Setting</Trans>
              </th>
              <td>
                <ul className="italic">
                  {settings.map((s) => (
                    <li className="mb-2" key={s.description}>
                      {s.description}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          )}
          {settings?.find((s) => s.location?.wikidataId) && (
            <tr>
              <th>
                <Trans>Location</Trans>
              </th>
              <td>
                <ul>
                  {settings
                    ?.filter((s) => s.location?.wikidataId)
                    .map((s) => (
                      <small key={s.location.wikidataId as string}>
                        <IdLink
                          id={s.location.wikidataId as string}
                          type="wikidata"
                        />
                      </small>
                    ))}
                </ul>
              </td>
            </tr>
          )}
          {basedOn && (
            <tr>
              <th>
                <Trans>Based on</Trans>
              </th>
              <td>
                <BasedOn refs={basedOn} />
              </td>
            </tr>
          )}
          {dictionaries && (
            <tr>
              <th>
                <Trans>Dictionaries</Trans>
              </th>
              <td>
                <Dictionaries dictionaries={dictionaries} />
              </td>
            </tr>
          )}
          {formalia && (
            <tr>
              <th>
                <Trans>Formalia</Trans>
              </th>
              <td>
                <ul>
                  {formalia.map((text) => (
                    <li key={text}>{text}</li>
                  ))}
                </ul>
              </td>
            </tr>
          )}
          {keywords && (
            <tr>
              <th>
                <Trans>Keywords</Trans>
              </th>
              <td>
                <ul className="list-disc text-gray-400">
                  {keywords.map((k) => (
                    <li key={k}>
                      <span className="text-black">{k}</span>
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
