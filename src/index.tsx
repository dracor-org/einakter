import React from 'react';
import ReactDOM from 'react-dom';
import {HelmetProvider} from 'react-helmet-async';
import { I18nProvider } from '@lingui/react';
import i18n from './i18n';
import App from './App';
import * as serviceWorker from './serviceWorker';

import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <I18nProvider i18n={i18n}>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </I18nProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
