import React, {useEffect} from 'react';
import {useLocation, useParams} from "react-router-dom";
import {Table} from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Authors from './Authors';
import Dictionaries from './Dictionaries';
import Years from './Years';
import IdLink from './IdLink';
import {CastMember, Play} from '../types';
import data from '../data.json';

const groupIcon = <FontAwesomeIcon icon="users" size="sm" title="Group"/>;

export default function Details () {
  const { id } = useParams<{id: string}>();
  const { pathname } = useLocation();

  const play: Play | undefined = data.find((p: Play) => p.slug === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (!play) {
    return <strong>No such play</strong>;
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
    setting,
    location,
    basedOn,
  } = play;

  return (
    <div className="details">
      <hgroup>
        <h2>
          <Authors authors={authors}/>
        </h2>
        <h1>{title}</h1>
        {subtitle && <h3>{subtitle}</h3>}
      </hgroup>
      <Table>
        <tbody>
          {comments && (
            <tr>
              <th>Comments</th>
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
              <th>Reviews</th>
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
            <th>Dates</th>
            <td>
              <Years written={created} premiere={premiered} print={printed}/>
            </td>
          </tr>
          {numberOfScenes && (
            <tr>
              <th>Number of Scenes</th>
              <td>{numberOfScenes}</td>
            </tr>
          )}
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
              <th>Editions</th>
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
              <th>Dramatis personae</th>
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
                      {c.gender && <span> ({c.gender})</span>}
                      {' '}
                      {c.isGroup && groupIcon}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          )}
          {setting && (
            <tr>
              <th>Setting</th>
              <td>{setting}</td>
            </tr>
          )}
          {location?.wikidataId && (
            <tr>
              <th>Location</th>
              <td>
                <IdLink id={location.wikidataId} type="wikidata"/>
              </td>
            </tr>
          )}
          {basedOn && (
            <tr>
              <th>Based on</th>
              <td>
                <ul>
                  {basedOn.map(text => (
                    <li key={text}>
                      <ReactMarkdown>{text}</ReactMarkdown>
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          )}
          {dictionaries && (
            <tr>
              <th>Dictionaries</th>
              <td>
                <Dictionaries dictionaries={dictionaries}/>
              </td>
            </tr>
          )}
          {formalia && (
            <tr>
              <th>Formalia</th>
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
              <th>Keywords</th>
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
