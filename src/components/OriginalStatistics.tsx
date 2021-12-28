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
      <table className="table-fixed m-0">
        <tbody>
          <td className="w-1/6 pl-0">
            <p className="md:text-6xl text-4xl font-thin">{plays.length}</p>
            <p className="font-medium max-w-[20ch]">
              <Trans>Number of originals</Trans>
            </p>
          </td>
          <td className="w-1/6 pl-0">
            <p className="md:text-6xl text-4xl font-thin">
              {Object.keys(names).length}
            </p>
            <p className="font-medium max-w-[20ch]">
              <Trans>Authors</Trans>
            </p>
          </td>
          <td className="w-1/6 pl-0">
            <p className="md:text-6xl text-4xl font-thin">{anonymous}</p>
            <p className="font-medium max-w-[20ch]">
              <Trans>Plays published anonymously</Trans>
            </p>
          </td>
          <td className="w-3/6 pl-0">
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
                <span className="whitespace-nowrap">{localLanguageName(code)}: <span className="font-medium">{languages[code]}</span></span>
              </span>
            ))}
            <p className="font-medium max-w-[20ch]">
            <Trans>Languages</Trans>
            </p>
          </td>
        </tbody>
      </table>
    </div>
  );
};

export default OriginalStatistics;
