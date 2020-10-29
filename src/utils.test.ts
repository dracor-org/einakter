import {Play} from './types';
import {normalizeYear} from './utils';

const playTmpl: Play = {
  slug: 'foo-bar',
  title: 'Foo Bar',
};

describe('normalizeYear', () => {
  
  it('handles integer for premiered', () => {
    const play = {...playTmpl, premiered: 1789};
    expect(normalizeYear(play)).toBe(1789);
  });

  it('handles YYYY-MM string for premiered', () => {
    const play = {...playTmpl, premiered: '1789-01'};
    expect(normalizeYear(play)).toBe(1789);
  });

  it('handles YYYY-MM-DD string for premiered', () => {
    const play = {...playTmpl, premiered: '1789-01-02'};
    expect(normalizeYear(play)).toBe(1789);
  });

  it('uses earlier year of "premiered" and "printed"', () => {
    const play = {...playTmpl, premiered: 1789, printed: 1805};
    expect(normalizeYear(play)).toBe(1789);

    const play2 = {...playTmpl, premiered: 1805, printed: 1777};
    expect(normalizeYear(play2)).toBe(1777);
  });

  it('uses "created" when it is the only defined year', () => {
    const play = {...playTmpl, created: 1777};
    expect(normalizeYear(play)).toBe(1777);
  });

  it('uses "created" when it is more than 10 years before publication', () => {
    const play = {...playTmpl, premiered: 1810, created: 1777};
    expect(normalizeYear(play)).toBe(1777);
  });

  it('prefers publication year when less than 10 years after creation', () => {
    const play = {...playTmpl, premiered: 1810, created: 1805};
    expect(normalizeYear(play)).toBe(1810);
  });
});
