import { i18n } from '@lingui/core';
import { detect, fromStorage } from '@lingui/detect-locale';
import { en, de, tr } from 'make-plural/plurals';
import { messages as enMessages } from './locales/en/messages';
import { messages as deMessages } from './locales/de/messages';
import { messages as trMessages } from './locales/tr/messages';

const storageKey = 'uiLanguage';

i18n.loadLocaleData({
  en: { plurals: en },
  de: { plurals: de },
  tr: { plurals: tr },
});

i18n.load({
  en: enMessages,
  de: deMessages,
  tr: trMessages,
});

const language = detect(
  fromStorage(storageKey, {useSessionStorage: true}),
  () => 'en', // default language
) as string;

i18n.activate(language);

export const locales = ['en', 'de', 'tr'];

export function setLocale (locale: string) {
  i18n.activate(locale);
  sessionStorage.setItem(storageKey, locale);
}

export default i18n;
