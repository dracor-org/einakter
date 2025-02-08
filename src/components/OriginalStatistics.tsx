import {Trans} from '@lingui/react/macro';
import {Th, Td} from './Statistics';
import {AuthorMap, OriginalPlay} from '../types';
import {localLanguageName} from '../languages';

const anonRegex = /^An[oó]n/;

interface Props {
  authors: AuthorMap;
  plays: OriginalPlay[];
  className?: string;
}

const OriginalStatistics = ({authors, plays = [], className = ''}: Props) => {
  // find non-anonymous authors
  const ids: {[id: string]: number} = {};
  const names: {[id: string]: number} = {};
  plays.forEach((play: OriginalPlay) => {
    play.authors?.forEach(({name, wikidata}) => {
      if (wikidata && authors[wikidata || '']) {
        ids[wikidata] = ids[wikidata] ? ids[wikidata] + 1 : 1;
      } else if (name && !name.match(anonRegex)) {
        names[name] = names[name] ? names[name] + 1 : 1;
      }
    });
  });

  const authorsWikidata = Object.keys(ids).length;
  const authorsWithoutId = Object.keys(names).length;
  const authorsTotal = authorsWikidata + authorsWithoutId;
  const authorsMale = Object.keys(ids).filter(
    (id) => authors[id].gender === 'male'
  ).length;
  const authorsFemale = Object.keys(ids).filter(
    (id) => authors[id].gender === 'female'
  ).length;

  const anonymous = plays.filter((p) => {
    return (
      !p.authors ||
      p.authors.length === 0 ||
      p.authors.find((a) => a.name?.match(anonRegex))
    );
  }).length;

  const languages: {[code: string]: number} = {};
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
            <Td width="1/6">{authorsTotal}</Td>
            <Td width="1/6">{anonymous}</Td>
            <td className="w-3/6 pl-0 pb-0">
              {Object.keys(languages)
                .sort((a, b) => {
                  if (languages[a] > languages[b]) {
                    return -1;
                  }
                  if (languages[a] < languages[b]) {
                    return 1;
                  }
                  return 0;
                })
                .map((code, i) => (
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
            <Th width="1/6">
              <Trans>Number of originals</Trans>
            </Th>
            <Th width="1/6">
              <p>
                <Trans>Authors</Trans>
              </p>
              <small className="font-normal whitespace-nowrap">
                Wikidata: {authorsWikidata}, <br />
                <Trans>male</Trans>: {authorsMale}, <Trans>female</Trans>:{' '}
                {authorsFemale}
              </small>
            </Th>
            <Th width="1/6">
              <Trans>Plays published anonymously</Trans>
            </Th>
            <Th>
              <Trans>Languages</Trans>
            </Th>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default OriginalStatistics;
