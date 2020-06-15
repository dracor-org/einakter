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

const plays = data.map((p: Play) => {
  const normalizedYear = normalizeYear(p);
  return {...p, normalizedYear}
});

export default plays;
