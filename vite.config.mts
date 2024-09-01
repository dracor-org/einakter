import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import {lingui} from '@lingui/vite-plugin';
import mdx from '@mdx-js/rollup';

export default {
  base: '/',
  plugins: [
    mdx(),
    eslint(),
    react({
      babel: {
        plugins: ['macros'],
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
