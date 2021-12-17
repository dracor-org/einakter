import React from 'react';
import {Trans} from '@lingui/macro';
import {OriginalPlay} from '../types';
import {localLanguageName} from '../languages';

const anonRegex = /^An[oó]n/;

interface Props {
  plays: OriginalPlay[]
  className?: string;
};

const OriginalStatistics = ({plays = [], className = ''}: Props) => {
  // find non-anonymous authors
  const names: {[id: string]: number} = {};
  plays.forEach((play: OriginalPlay) => {
    play.authors?.forEach(a => {
      if (!a.name?.match(anonRegex)) {
        if (a.name) names[a.name] = names[a.name] ? names[a.name] + 1 : 1;
      }
    });
  });

  const anonymous = plays.filter(p => {
    return !p.authors
      || p.authors.length === 0
      || p.authors.find(a => a.name?.match(anonRegex))
  }).length

  const languages: {[code:string]: number} = {};
  plays.forEach((play) => {
    if (!play.language) {
      return;
    }
    if (languages[play.language]) {
      languages[play.language]++;
    } else {
      languages[play.language] = 1;
    }
  });

  return (
    <div className={className}>
      <table className="table-auto m-0">
        <tbody>
          <tr>
            <th>
              <Trans>Number of originals</Trans>
            </th>
            <td>{plays.length}</td>
          </tr>
          <tr>
            <th>
              <Trans>Authors</Trans>
            </th>
            <td>
              {Object.keys(names).length}
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
              <Trans>Languages</Trans>
            </th>
            <td>
              {Object.keys(languages).sort((a, b) => {
                if (languages[a] > languages[b]) {
                  return -1;
                }
                if (languages[a] < languages[b]) {
                  return 1;
                }
                return 0;
              }).map((code, i) => (
                <span key={code}>
                  {i > 0 && ', '}
                  {localLanguageName(code)} ({languages[code]})
                </span>
              ))}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default OriginalStatistics;
