import {Play} from './types';
import data from './data.json';

function normalizeYear (play: Play) {
  const {premiered: p, printed, created} = play;
  const premiered: number = parseInt(p as string);
  const published = (premiered && printed)
    ? Math.min(premiered, printed)
    : premiered || printed;

  let year;
  if (created &&  published) {
    year = (published - created > 10) ? created : published;
  } else {
    year = created || published
  }

  return year;
}

function countCharacters(play: Play) {
  const {cast} = play;
  if (!cast) return undefined;
  return cast.reduce((num, item) => {
    const n = item.group ? item.group.length : 1;
    return num + n;
  }, 0)
}

const plays = data.map((p: Play) => {
  const normalizedYear = normalizeYear(p);
  const numberOfCharacters = countCharacters(p);
  const authors = p.author ? [p.author] : p.authors || [];
  return {...p, authors, normalizedYear, numberOfCharacters}
});

export default plays;
