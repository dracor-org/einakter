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
      <table className="table-fixed md:w-full m-0">
        <tbody>
          <td className="w-1/5 pl-0">
            <p className="md:text-6xl text-4xl font-thin">{plays.length}</p>
            <p className="font-medium">
              <Trans>One-act plays</Trans>
            </p>
          </td>
          <td className="w-1/5 pl-0">
              <span className="md:text-6xl text-4xl font-thin">{authorsTotal}</span>
              <p className="font-medium">
                <Trans>Authors</Trans>
              </p>
              <small>
                Wikidata: {authorsWikidata},{' '}<br/> 
                <Trans>male</Trans>: {authorsMale},{' '}
                <Trans>female</Trans>: {authorsFemale}
              </small>
          </td>
          <td className="w-1/5 pl-0">
            <p className="md:text-6xl text-4xl font-thin">{anonymous}</p>
            <p className="font-medium max-w-[20ch]">
              <Trans>Plays published anonymously</Trans>
            </p>
          </td>
          <td className="w-1/5 pl-0">
            <p className="md:text-6xl text-4xl font-thin">{plays.filter(p => p.basedOn?.length).length}</p>
            <p className="font-medium max-w-[20ch]">
              <Trans>Plays translated/adapted from other languages</Trans>
            </p>
          </td>
          <td className="w-1/5 pl-0">
            <p className="md:text-6xl text-4xl font-thin">{numCharacters}</p>
            <p className="font-medium">
              <Trans>Characters</Trans>
            </p>
          </td>
        </tbody>
      </table>
    </div>
  );
};

export default Statistics;
