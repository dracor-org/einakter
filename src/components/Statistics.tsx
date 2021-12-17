import React from 'react';
import {Trans} from '@lingui/macro';
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
  className?: string;
};

const Statistics = ({authors = {}, plays = [], className = ''}: Props) => {
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
    <div className={className}>
      <table className="table-auto m-0">
        <tbody>
          <tr>
            <th>
              <Trans>One-act plays</Trans>
            </th>
            <td>{plays.length}</td>
          </tr>
          <tr>
            <th>
              <Trans>Authors</Trans>
            </th>
            <td>
              {authorsTotal}
              <br/>
              <small>
                Wikidata: {authorsWikidata},{' '}
                <Trans>male</Trans>: {authorsMale},{' '}
                <Trans>female</Trans>: {authorsFemale}
              </small>
            </td>
          </tr>
          <tr>
            <th>
              <Trans>Plays published anonymously</Trans>
            </th>
            <td>{anonymous}</td>
          </tr>
          <tr>
            <th>
              <Trans>Plays translated/adapted from other languages</Trans>
            </th>
            <td>{plays.filter(p => p.basedOn?.length).length}</td>
          </tr>
          <tr>
            <th>
              <Trans>Characters</Trans>
            </th>
            <td>{numCharacters}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Statistics;
