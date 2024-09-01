import {render, screen} from '@testing-library/react';
import {I18nProvider} from '@lingui/react';
import {HelmetProvider} from 'react-helmet-async';
import i18n from './i18n';
import App from './App';

test('renders heading', () => {
  render(
    <I18nProvider i18n={i18n}>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </I18nProvider>
  );
  const element = screen.getByText(/^about$/i);
  expect(element).toBeInTheDocument();
});
