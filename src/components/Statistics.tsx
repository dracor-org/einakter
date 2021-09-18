import React, {useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Play} from '../types';

interface AuthorData {
  [id: string]: {
    name: string
    gnd?: string
    gender?: string
    birth?: {
      date?: string
      place?: string
      placeId?: string
    }
    death?: {
      date?: string
      place?: string
      placeId?: string
    }
  }
};

interface Props {
  authors: AuthorData
  plays: Play[]
};

const Statistics = ({authors = {}, plays = []}: Props) => {
  const [expanded, setExpanded] = useState(false);

  // find non-anonymous authors without IDs
  const names: {[id: string]: number} = {};
  plays.forEach((play: Play) => {
    play.authors?.forEach(a => {
      const info = authors[a.wikidata || ''];
      if (!info && a.pseudonym !== 'Anonym') {
        if (a.name) names[a.name] = names[a.name] ? names[a.name] + 1 : 1;
      }
    });
  });

  const authorsWithoutId = Object.keys(names).length;
  const authorsWikidata = Object.keys(authors).length;
  const authorsTotal = authorsWikidata + authorsWithoutId;
  const authorsMale =
    Object.values(authors).filter(a => a.gender === 'male').length;
  const authorsFemale =
    Object.values(authors).filter(a => a.gender === 'female').length;

  const anonymous = plays.filter(p => {
    return !p.authors
      || p.authors.length === 0
      || p.authors.find(a => a.pseudonym === 'Anonym')
  }).length

  const numCharacters = plays.reduce((num: number, p: Play) => {
    p.cast?.forEach(member => {
      if (member.group) {
        num += member.group.length;
      } else {
        num++;
      }
    });
    return num;
  }, 0)

  return (
    <div className="statistics">
      <table className="table table-sm table-dark">
        <caption
          onClick={() => setExpanded(!expanded)}
          title={expanded ? 'Hide' : 'Show more'}
        >
          {expanded ? (
            <>
              {`Statistics `}
              <FontAwesomeIcon icon="caret-down" title="Hide"/>
            </>
          ) : (
            <>
              {`Database currently containing ${plays.length} one-act plays `}
              {`featuring ${numCharacters} characters `}
              <FontAwesomeIcon icon="caret-up" title="Show more"/>
            </>
          )}
        </caption>
        <tbody style={{display: expanded ? 'table-row-group' : 'none'}}>
          <tr>
            <th>One-act plays</th>
            <td>{plays.length}</td>
          </tr>
          <tr>
            <th>Authors</th>
            <td>
              {authorsTotal}
              <br/>
              <small>m: {authorsMale}, f: {authorsFemale}</small>
            </td>
          </tr>
          <tr>
            <th>Plays published anonymously</th>
            <td>{anonymous}</td>
          </tr>
          <tr>
            <th>Plays translated/adapted from other languages</th>
            <td>{plays.filter(p => p.basedOn?.length).length}</td>
          </tr>
          <tr>
            <th>Characters</th>
            <td>{numCharacters}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Statistics;
