import {useLingui} from '@lingui/react';
import {t} from '@lingui/core/macro';
import {Years as DracorYears} from '@dracor/react';

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
    <DracorYears
      written={written as number | undefined}
      premiere={premiere as number | undefined}
      print={print}
      locale={locale}
      labelWritten={t`written`}
      labelPremiered={t`premiered`}
      labelPrinted={t`printed`}
    />
  );
};

export default Years;
