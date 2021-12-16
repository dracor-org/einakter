import React, {useEffect, useContext} from 'react';
import {useLocation, useParams} from "react-router-dom";
import {Table, Row, Col} from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import {Helmet} from "react-helmet";
import {Trans} from '@lingui/macro';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Authors from './Authors';
import AuthorInfo from './AuthorInfo';
import Dictionaries from './Dictionaries';
import Years from './Years';
import IdLink from './IdLink';
import BasedOn from './BasedOn';
import {EinakterContext} from '../context';
import {CastMember, Play} from '../types';

const groupIcon = <FontAwesomeIcon icon="users" size="sm" title="Group"/>;

export default function Details () {
  const { id } = useParams<{id: string}>();
  const { pathname } = useLocation();
  const { plays: data } = useContext(EinakterContext);

  const play: Play | undefined = data.find((p: Play) => p.slug === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (!play) {
    return <strong><Trans>No such play</Trans></strong>;
  }
  
  const {
    title,
    subtitle,
    authors = [],
    cast,
    comments,
    created,
    dictionaries,
    editions,
    formalia,
    ids,
    keywords,
    numberOfScenes,
    premiered,
    printed,
    reviews,
    settings,
    basedOn,
  } = play;

  const authorNames = authors.map(a => a.pseudonym || a.name || '').join(' · ');
  const pageTitle = authorNames ? `${authorNames}: ${title}` : title;

  return (
    <div className="details p-4 flex flex-col">
      <Helmet>
        <title>Einakter: {pageTitle}</title>
      </Helmet>
      <Row>
        <Col>
          <hgroup>
            <h2>
              <Authors authors={authors}/>
            </h2>
            <h1>{title}</h1>
            {subtitle && <h3>{subtitle}</h3>}
          </hgroup>
        </Col>
        <Col>
          <div className="author-info-container">
            {authors.filter(a => Boolean(a.wikidata)).map(a => (
              <AuthorInfo
                key={a.wikidata}
                fullname={a.name || ''}
                wikidataId={a.wikidata || ''}
              />
            ))}
          </div>
        </Col>
      </Row>
      <Table>
        <tbody>
          {comments && (
            <tr>
              <th>
                <Trans>Comments</Trans>
              </th>
              <td>
                <ul>
                  {comments.map((c, i) => (
                    <li key={`comment-${i}`}>
                      <ReactMarkdown>{c}</ReactMarkdown>
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
                <ul>
                  {reviews.map((r, i) => (
                    <li key={`review-${i}`}>
                      <ReactMarkdown>{r}</ReactMarkdown>
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
              <Years written={created} premiere={premiered} print={printed}/>
            </td>
          </tr>
          {numberOfScenes && (
            <tr>
              <th>
                <Trans>Number of Scenes</Trans>
              </th>
              <td>{numberOfScenes}</td>
            </tr>
          )}
          {ids && (
            <tr>
              <th>
                <Trans>Links</Trans>
              </th>
              <td>
                <ul>
                  {ids.dracor && (
                    <li>DraCor: 
                      {' '}
                      <small className="inline-flex bg-white rounded px-1.5 gap-1 align-text-bottom">
                        <img src="/DraCor.svg" width="12" alt="DraCor"/>
                        <IdLink id={ids.dracor} type="dracor"/>
                      </small>
                    </li>
                  )}
                  {ids.wikidata && (
                    <li>
                      Wikidata: 
                      {' '}
                     <small className="inline-flex bg-white rounded px-1.5 gap-1 align-text-bottom">
                      <img src="/wikidata.svg" width="16" alt="wikidata"/>
                      <IdLink id={ids.wikidata} type="wikidata"/>
                     </small>
                    </li>
                  )}
                  {ids.weber && (
                    <li>
                      Weber-Gesamtausgabe: <IdLink id={ids.weber} type="weber"/>
                    </li>
                  )}
                </ul>
              </td>
            </tr>
          )}
          {editions && (
            <tr>
              <th>
                <Trans>Editions</Trans>
              </th>
              <td>
                <ul>
                  {editions.map(e => (
                    <li key={e.url || e.title}>
                      <a href={e.url}>{e.title}</a>
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
                  {cast.map((c: CastMember) => c.group ? (
                    <li key={c.role}>
                      <em>{c.role}</em>
                      <ul>
                      {c.group && c.group.map(member => (
                        <li key={member.name}>
                          {member.name}
                          {member.role && (<i> {member.role}</i> )}
                          {member.gender && ` (${member.gender})`}
                          {' '}
                          {member.isGroup && groupIcon}
                        </li>
                      ))}
                      </ul>
                    </li>
                  ) : (
                    <li key={c.name}>
                      {c.name}
                      {c.role && (<i> {c.role}</i> )}
                      {' '}
                      {c.gender === 'm' && (
                        <FontAwesomeIcon icon="mars" title="male" />
                      )}
                      {c.gender === 'f' && (
                        <FontAwesomeIcon icon="venus" title="female" />
                      )}
                      {c.gender === 'u' && (
                        <FontAwesomeIcon icon="genderless" title="undefined" />
                      )}
                      {' '}
                      {c.isGroup && groupIcon}
                    </li>
                  ))}
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
                <ul>
                  {settings.map((s) => (
                    <li key={s.description}>{s.description}</li>
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
                  {settings?.filter((s) => s.location?.wikidataId).map((s) => (
                    <small className="inline-flex bg-white rounded px-1.5 gap-1 align-text-bottom" key={s.location.wikidataId as string}>
                      <img src="/wikidata.svg" width="16" alt="wikidata"/>
                      <IdLink id={s.location.wikidataId as string} type="wikidata"/>
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
                <BasedOn refs={basedOn}/>
              </td>
            </tr>
          )}
          {dictionaries && (
            <tr>
              <th>
                <Trans>Dictionaries</Trans>
              </th>
              <td>
                <Dictionaries dictionaries={dictionaries}/>
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
                  {formalia.map(text => (
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
                <ul>
                  {keywords.map(k => (
                    <li key={k}>{k}</li>
                  ))}
                </ul>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
