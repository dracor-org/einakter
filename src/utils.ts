import {Play} from './types';

export function normalizeYear (play: Play) {
  const {premiered: p, printed, created} = play;
  const premiered: number = parseInt(p as string);
  const published = (premiered && printed)
    ? Math.min(premiered, printed)
    : premiered || printed;

  let year;
  if (created && published) {
    year = (published - created > 10) ? created : published;
  } else {
    year = created || published
  }

  return year;
};

export function countCharacters (play: Play) {
  const {cast} = play;
  if (!cast) return undefined;
  return cast.reduce((num, item) => {
    const n = item.group ? item.group.length : 1;
    return num + n;
  }, 0)
};
