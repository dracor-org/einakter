import React from 'react';
import {useParams} from "react-router-dom";
import {Table} from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import Years from './Years';
import data from '../data.json';

export default  function Details () {
  const { id } = useParams();
  const play = data.find((p: any) => p.slug === id);

  if (!play) {
    return <strong>No such play</strong>;
  }
  
  const {
    title,
    subtitle,
    author,
    cast,
    comment,
    created,
    editions,
    ids,
    keywords,
    numberOfScenes,
    premiered,
    printed,
  } = play;

  return (
    <div>
      <h2>
        {author.name}
        {author.pseudonym && (<i> ({author.pseudonym})</i>)}
        {author.wikidata && (
          <small>
            {' '}
            <a href={`https://www.wikidata.org/wiki/${author.wikidata}`}>
              {author.wikidata}
            </a>
          </small>
        )}
      </h2>
      <h1>{title}</h1>
      {subtitle && <h3>{subtitle}</h3>}
      
      <Table>
        <tbody>
          <tr className="dates">
            <th>Dates</th>
            <td>
              <Years written={created} premiere={premiered} print={printed}/>
            </td>
          </tr>
          <tr>
            <th>Number of Scenes</th>
            <td>{numberOfScenes}</td>
          </tr>
          {ids && (
            <tr>
              <th>Links</th>
              <td>
                <ul>
                  {ids.dracor && <li>DraCor: <a href={`https://dracor.org/id/${ids.dracor}`}>{ids.dracor}</a></li>}
                  {ids.wikidata && <li>Wikidata: <a href={`https://www.wikidata.org/wiki/${ids.wikidata}`}>{ids.wikidata}</a></li>}
                </ul>
              </td>
            </tr>
          )}
          {cast && (
            <tr>
              <th>Cast</th>
              <td>
                <ul>
                  {cast.map(c => (
                    <li key={c.name}>
                      {c.name}
                      {c.gender && <span> ({c.gender})</span>}
                    </li>
                  ))}
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
                    <li key={e.url}>
                      <a href={e.url}>{e.title}</a>
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          )}
          {comment && (
            <tr>
              <th>Comment</th>
              <td>
                <ReactMarkdown>{comment}</ReactMarkdown>
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
