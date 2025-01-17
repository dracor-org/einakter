import {t} from '@lingui/core/macro';

export function localLanguageName(code: string): string {
  switch (code) {
    case 'cze':
      return t`Czech`;
    case 'dan':
      return t`Danish`;
    case 'dut':
      return t`Dutch`;
    case 'eng':
      return t`English`;
    case 'fre':
      return t`French`;
    case 'ger':
      return t`German`;
    case 'ita':
      return t`Italian`;
    case 'lat':
      return t`Latin`;
    case 'rus':
      return t`Russian`;
    case 'spa':
      return t`Spanish`;
    default:
      return code;
  }
}
