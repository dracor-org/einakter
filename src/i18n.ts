import {i18n} from '@lingui/core';
import {detect, fromStorage} from '@lingui/detect-locale';
import {en, de, es, fa, fr, ja, ko, ku, ru, uk, zh} from 'make-plural/plurals';
import {messages as enMessages} from './locales/en/messages';
import {messages as deMessages} from './locales/de/messages';
import {messages as esMessages} from './locales/es/messages';
import {messages as faMessages} from './locales/fa/messages';
import {messages as frMessages} from './locales/fr/messages';
import {messages as jaMessages} from './locales/ja/messages';
import {messages as koMessages} from './locales/ko/messages';
import {messages as kuMessages} from './locales/ku/messages';
import {messages as ruMessages} from './locales/ru/messages';
import {messages as ukMessages} from './locales/uk/messages';
import {messages as zhMessages} from './locales/zh/messages';
import {messages as tokMessages} from './locales/jbo-tok/messages';

const storageKey = 'uiLanguage';

i18n.loadLocaleData({
  en: {plurals: en},
  de: {plurals: de},
  es: {plurals: es},
  fa: {plurals: fa},
  fr: {plurals: fr},
  ja: {plurals: ja},
  ko: {plurals: ko},
  ku: {plurals: ku},
  ru: {plurals: ru},
  uk: {plurals: uk},
  zh: {plurals: zh},
  tok: {plurals: zh},
});

i18n.load({
  en: enMessages,
  de: deMessages,
  es: esMessages,
  fa: faMessages,
  fr: frMessages,
  ja: jaMessages,
  ko: koMessages,
  ku: kuMessages,
  ru: ruMessages,
  uk: ukMessages,
  zh: zhMessages,
  tok: tokMessages,
});

const language = detect(
  fromStorage(storageKey, {useSessionStorage: true}),
  () => 'en' // default language
) as string;

i18n.activate(language);

export const locales = [
  'en',
  'de',
  'es',
  'fa',
  'fr',
  'ja',
  'ko',
  'ku',
  'ru',
  'uk',
  'zh',
  'tok',
];

export function setLocale(locale: string) {
  i18n.activate(locale);
  sessionStorage.setItem(storageKey, locale);
}

export default i18n;
