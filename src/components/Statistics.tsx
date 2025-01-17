import {ReactNode} from 'react';
import {Trans} from '@lingui/react/macro';
import {Play} from '../types';

interface AuthorData {
  [id: string]: {
    name: string;
    gnd?: string;
    gender?: string;
    birth?: {
      date?: string;
      place?: string;
      placeId?: string;
    };
    death?: {
      date?: string;
      place?: string;
      placeId?: string;
    };
  };
}

export const Td = ({
  className,
  children,
  width,
}: {
  children: ReactNode;
  className?: string;
  width?: string;
}) => {
  return (
    <td
      className={`w-${width || '1/5'} pl-0 pb-0 md:text-6xl text-4xl font-thin ${className || ''}`}
    >
      {children}
    </td>
  );
};

export const Th = ({
  className,
  children,
  width,
}: {
  children: ReactNode;
  className?: string;
  width?: string;
}) => {
  return (
    <th
      className={`w-${width || '1/5'} pl-0 pt-0 text-base ${className || ''}`}
    >
      {children}
    </th>
  );
};

interface Props {
  authors: AuthorData;
  plays: Play[];
  className?: string;
}

const Statistics = ({authors = {}, plays = [], className = ''}: Props) => {
  // find non-anonymous authors without IDs
  const names: {[id: string]: number} = {};
  plays.forEach((play: Play) => {
    play.authors?.forEach((a) => {
      const info = authors[a.wikidata || ''];
      if (!info && a.pseudonym !== 'Anonym') {
        if (a.name) names[a.name] = names[a.name] ? names[a.name] + 1 : 1;
      }
    });
  });

  const authorsWithoutId = Object.keys(names).length;
  const authorsWikidata = Object.keys(authors).length;
  const authorsTotal = authorsWikidata + authorsWithoutId;
  const authorsMale = Object.values(authors).filter(
    (a) => a.gender === 'male'
  ).length;
  const authorsFemale = Object.values(authors).filter(
    (a) => a.gender === 'female'
  ).length;

  const anonymous = plays.filter((p) => {
    return (
      !p.authors ||
      p.authors.length === 0 ||
      p.authors.find((a) => a.pseudonym === 'Anonym')
    );
  }).length;

  const numCharacters = plays.reduce((num: number, p: Play) => {
    p.cast?.forEach((member) => {
      if (member.group) {
        num += member.group.length;
      } else {
        num++;
      }
    });
    return num;
  }, 0);

  return (
    <div className={className}>
      <table className="table-fixed md:w-full m-0">
        <tbody>
          <tr className="bg-transparent">
            <Td>{plays.length}</Td>
            <Td>{authorsTotal}</Td>
            <Td>{anonymous}</Td>
            <Td>{plays.filter((p) => p.basedOn?.length).length}</Td>
            <Td>{numCharacters}</Td>
          </tr>
          <tr className="bg-transparent">
            <Th>
              <Trans>One-act plays</Trans>
            </Th>
            <Th>
              <p>
                <Trans>Authors</Trans>
              </p>
              <small className="font-normal">
                Wikidata: {authorsWikidata}, <br />
                <Trans>male</Trans>: {authorsMale}, <Trans>female</Trans>:{' '}
                {authorsFemale}
              </small>
            </Th>
            <Th className="max-w-[20ch]">
              <Trans>Plays published anonymously</Trans>
            </Th>
            <Th className="max-w-[20ch]">
              <Trans>Plays translated/adapted from other languages</Trans>
            </Th>
            <Th>
              <Trans>Characters</Trans>
            </Th>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Statistics;
