import React from 'react';
import ReactDOM from 'react-dom';
import { i18n } from '@lingui/core';
import { detect, fromStorage } from "@lingui/detect-locale"
import { I18nProvider } from '@lingui/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { en, de, tr } from 'make-plural/plurals';
import { messages as enMessages } from './locales/en/messages';
import { messages as deMessages } from './locales/de/messages';
import { messages as trMessages } from './locales/tr/messages';

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

const defaultLanguage = 'en';
const language = detect(
  fromStorage('lang', {useSessionStorage: true}),
  () => defaultLanguage,
) as string;

i18n.activate(language);

ReactDOM.render(
  <React.StrictMode>
    <I18nProvider i18n={i18n}>
      <App />
    </I18nProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
