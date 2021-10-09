import React from 'react';
import ReactDOM from 'react-dom';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { messages } from './locales/en/messages';

i18n.load('en', messages)
i18n.activate('en')


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
