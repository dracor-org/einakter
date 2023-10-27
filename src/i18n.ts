import { i18n } from '@lingui/core';
import { detect, fromStorage } from '@lingui/detect-locale';
import { en, de, es, fr, ja, ko, ru, zh } from 'make-plural/plurals';
import { messages as enMessages } from './locales/en/messages';
import { messages as deMessages } from './locales/de/messages';
import { messages as esMessages } from './locales/es/messages';
import { messages as frMessages } from './locales/fr/messages';
import { messages as jaMessages } from './locales/ja/messages';
import { messages as koMessages } from './locales/ko/messages';
import { messages as ruMessages } from './locales/ru/messages';
import { messages as zhMessages } from './locales/zh/messages';
import { messages as tokMessages } from './locales/jbo-tok/messages'

const storageKey = 'uiLanguage';

i18n.loadLocaleData({
  en: { plurals: en },
  de: { plurals: de },
  es: { plurals: es },
  fr: { plurals: fr },
  ja: { plurals: ja },
  ko: { plurals: ko },
  ru: { plurals: ru },
  zh: { plurals: zh },
  tok: { plurals: zh },
});

i18n.load({
  en: enMessages,
  de: deMessages,
  es: esMessages,
  fr: frMessages,
  ja: jaMessages,
  ko: koMessages,
  ru: ruMessages,
  zh: zhMessages,
  tok: tokMessages,
});

const language = detect(
  fromStorage(storageKey, {useSessionStorage: true}),
  () => 'en', // default language
) as string;

i18n.activate(language);

export const locales = ['en', 'de', 'es', 'fr', 'ja', 'ko', 'ru', 'zh', 'tok'];

export function setLocale (locale: string) {
  i18n.activate(locale);
  sessionStorage.setItem(storageKey, locale);
}

export default i18n;
