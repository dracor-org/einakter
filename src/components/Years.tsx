import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useLingui} from '@lingui/react';
import {t} from '@lingui/core/macro';

export function formatEra(year?: string | number, ceBefore = 0) {
  if (year === undefined) {
    return '';
  }

  const y = parseInt(`${year}`, 10);

  if (y < 0) {
    return `${y * -1} BCE`;
  }

  if (y < ceBefore) {
    return `${y} CE`;
  }

  return String(y);
}

export function formatYear(year: string | number, locale = 'en-GB') {
  const yearString = `${year}`;
  // range, both BCE
  if (yearString.match('^-[0-9]{4}/-[0-9]{4}$')) {
    const years = yearString.split('/').map((y) => parseInt(y, 10) * -1);
    return `${years[0]}-${years[1]} BCE`;
  }

  // range, mixed era
  if (yearString.match('^-?[0-9]{4}/-?[0-9]{4}$')) {
    const years = yearString.split('/');
    return `${formatEra(years[0])}-${formatEra(years[1], 1000)}`;
  }

  // YYYY-MM
  if (yearString.match('^[0-9]{4}-[0-9]{2}$')) {
    const date = new Date(yearString);
    return date.toLocaleDateString(locale, {month: 'long', year: 'numeric'});
  }

  // YYYY-MM-DD
  if (yearString.match('^[0-9]{4}-[0-9]{2}-[0-9]{2}$')) {
    const date = new Date(yearString);
    return date.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  // not before
  if (yearString.match('^>-?[0-9]{4}')) {
    const year = yearString.substring(1);
    return `after ${formatEra(year, 1000)}`;
  }

  // not after
  if (yearString.match('^<-?[0-9]{4}')) {
    const year = yearString.substring(1);
    return `before ${formatEra(year, 1000)}`;
  }

  // single year
  if (yearString.match('^-?[0-9]{4}')) {
    return formatEra(yearString, 1000);
  }

  return yearString;
}

interface Props {
  written?: number;
  premiere?: string | number;
  print?: number;
}

const Years = ({written, premiere, print}: Props) => {
  const {
    i18n: {locale},
  } = useLingui();
  return (
    <>
      {written && (
        <>
          <span title={t`written`}>
            <FontAwesomeIcon icon="pen-fancy" size="sm" />
            &nbsp;
            {formatYear(written, locale)}
          </span>{' '}
        </>
      )}
      {premiere && (
        <>
          <span title={t`premiered`}>
            <FontAwesomeIcon icon="theater-masks" size="sm" />
            &nbsp;
            {formatYear(premiere, locale)}
          </span>{' '}
        </>
      )}
      {print && (
        <span title={t`printed`}>
          <FontAwesomeIcon icon="book" size="sm" />
          &nbsp;
          {formatYear(print, locale)}
        </span>
      )}
    </>
  );
};

export default Years;
