import React from 'react';
import { render } from '@testing-library/react';
import { I18nProvider } from '@lingui/react';
import i18n from './i18n';
import App from './App';

test('renders heading', () => {
  const { getByText } = render(
    <I18nProvider i18n={i18n}>
      <App />
    </I18nProvider>
  );
  const element = getByText(/einakter/i);
  expect(element).toBeInTheDocument();
});
