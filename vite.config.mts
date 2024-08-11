import {defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';

export default defineConfig({
  base: '/',
  plugins: [eslint(), react()],
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
});
