import {render, screen} from '@testing-library/react';
import {I18nProvider} from '@lingui/react';
import {
  RouterProvider,
  createRouter,
  createMemoryHistory,
} from '@tanstack/react-router';
import i18n from './i18n';
import {routeTree} from './routeTree.gen';

test('renders heading', async () => {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({initialEntries: ['/']}),
  });
  render(
    <I18nProvider i18n={i18n}>
      <RouterProvider router={router} />
    </I18nProvider>
  );
  const element = await screen.findByText(/^about$/i);
  expect(element).toBeInTheDocument();
});
