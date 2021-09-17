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

interface AuthorStats {
  total: number
  male: number
  female: number
  anonymus: number
}

interface Props {
  authors: AuthorData
  plays: Play[]
};

const Statistics = ({authors = {}, plays = []}: Props) => {
  const [expanded, setExpanded] = useState(false);

  const authorStats = plays.reduce((stats: AuthorStats, play: Play, ) => {
    stats.total += play.authors?.length || 0;
    play.authors?.forEach(a => {
      stats.total++;
      if (a.pseudonym === 'Anonym') stats.anonymus++;
      const info = authors[a.wikidata || ''];
      if (info?.gender === 'female') stats.female++;
      if (info?.gender === 'male') stats.male++;
    });
    return stats;
  }, {total: 0, male: 0, female: 0, anonymus: 0});

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
              {authorStats.total}
              <br/>
              <small>m: {authorStats.male}, f: {authorStats.female}</small>
            </td>
          </tr>
          <tr>
            <th>Plays published anonymously</th>
            <td>{authorStats.anonymus}</td>
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
