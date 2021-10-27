import { i18n } from '@lingui/core';
import { detect, fromStorage } from '@lingui/detect-locale';
import { en, de, es, ru, zh } from 'make-plural/plurals';
import { messages as enMessages } from './locales/en/messages';
import { messages as deMessages } from './locales/de/messages';
import { messages as esMessages } from './locales/es/messages';
import { messages as ruMessages } from './locales/ru/messages';
import { messages as zhMessages } from './locales/zh/messages';

const storageKey = 'uiLanguage';

i18n.loadLocaleData({
  en: { plurals: en },
  de: { plurals: de },
  es: { plurals: es },
  ru: { plurals: ru },
  zh: { plurals: zh },
});

i18n.load({
  en: enMessages,
  de: deMessages,
  es: esMessages,
  ru: ruMessages,
  zh: zhMessages,
});

const language = detect(
  fromStorage(storageKey, {useSessionStorage: true}),
  () => 'en', // default language
) as string;

i18n.activate(language);

export const locales = ['en', 'de', 'es', 'ru', 'zh'];

export function setLocale (locale: string) {
  i18n.activate(locale);
  sessionStorage.setItem(storageKey, locale);
}

export default i18n;
