import React from 'react';
import {Trans} from '@lingui/macro';
import {Th, Td} from './Statistics';
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
          <tr>
            <Td width="1/6">{plays.length}</Td>
            <Td width="1/6">{Object.keys(names).length}</Td>
            <Td width="1/6">{anonymous}</Td>
            <td className="w-3/6 pl-0 pb-0">
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
                  <span className="whitespace-nowrap">
                    {localLanguageName(code)}:{' '}
                    <b className="font-medium">{languages[code]}</b>
                  </span>
                </span>
              ))}
            </td>
          </tr>
          <tr>
            <Th width="1/6"><Trans>Number of originals</Trans></Th>
            <Th width="1/6"><Trans>Authors</Trans></Th>
            <Th width="1/6"><Trans>Plays published anonymously</Trans></Th>
            <Th><Trans>Languages</Trans></Th>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default OriginalStatistics;
