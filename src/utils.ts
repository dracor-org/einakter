import {Play, OriginalPlay} from './types';

export function normalizeYear(play: Play | OriginalPlay) {
  const {premiered: p, yearPrinted, yearWritten} = play;
  const premiered: number = parseInt(p as string);
  const published =
    premiered && yearPrinted
      ? Math.min(premiered, yearPrinted)
      : premiered || yearPrinted;

  let year;
  if (yearWritten && published) {
    year = published - yearWritten > 10 ? yearWritten : published;
  } else {
    year = yearWritten || published;
  }

  return year;
}

export function getEarliestYear(play: Play) {
  const {premiered, yearPrinted, yearWritten} = play;
  const years = [
    parseInt(premiered as string),
    yearPrinted,
    yearWritten,
  ].filter((y) => Boolean(y));
  return years.length > 0 ? Math.min(...(years as number[])) : undefined;
}

export function countCharacters(play: Play) {
  const {cast} = play;
  if (!cast) return undefined;
  return cast.reduce((num, item) => {
    const n = item.group ? item.group.length : 1;
    return num + n;
  }, 0);
}

export function countCharactersByGender(play: Play) {
  const {cast} = play;
  const initial = {male: 0, female: 0, unknown: 0, total: 0};
  if (!cast) return initial;
  return cast.reduce((num, item) => {
    if (item.group) {
      item.group.forEach((x) => {
        num.male += x.gender === 'm' ? 1 : 0;
        num.female += x.gender === 'f' ? 1 : 0;
        num.unknown += x.gender === 'u' ? 1 : 0;
        num.total++;
      });
    } else {
      num.male += item.gender === 'm' ? 1 : 0;
      num.female += item.gender === 'f' ? 1 : 0;
      num.unknown += item.gender === 'u' ? 1 : 0;
      num.total++;
    }
    return num;
  }, initial);
}

export function sortByYear(a: Play, b: Play) {
  const yearA = a.yearNormalized || -10000;
  const yearB = b.yearNormalized || -10000;
  if (yearA > yearB) return 1;
  if (yearA < yearB) return -1;
  return 0;
}
