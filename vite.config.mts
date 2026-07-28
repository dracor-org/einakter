import react from '@vitejs/plugin-react-swc';
import eslint from '@nabla/vite-plugin-eslint';
import {lingui} from '@lingui/vite-plugin';
import mdx from '@mdx-js/rollup';

export default {
  base: '/',
  plugins: [
    mdx(),
    eslint(),
    react({
      plugins: [['@lingui/swc-plugin', {}]],
      parserConfig: (id) => {
        if (id.endsWith('.tsx')) return {syntax: 'typescript', tsx: true};
        if (id.endsWith('.ts') || id.endsWith('.mts'))
          return {syntax: 'typescript', tsx: false};
        if (id.endsWith('.jsx')) return {syntax: 'ecmascript', jsx: true};
        return undefined;
      },
    }),
    lingui(),
  ],
  build: {
    outDir: 'build',
  },
  server: {
    open: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: true,
    reporters: ['verbose'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*'],
      exclude: ['**/*.test.tsx', '**/*.test.ts'],
    },
  },
};
