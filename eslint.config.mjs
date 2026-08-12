import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginTailwind from 'eslint-plugin-tailwindcss';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  {files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}']},
  {languageOptions: {globals: globals.browser}},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat['jsx-runtime'],
  pluginTailwind.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    settings: {
      tailwindcss: {
        cssConfigPath: 'src/index.css',
      },
    },
    rules: {
      camelcase: 'warn',
      'no-console': 'warn',
      'spaced-comment': ['error', 'always'],
      // Einakter uses several project-specific class names (`prose`,
      // `scroll-animation`, `dates`, …) that Tailwind doesn't know about.
      'tailwindcss/no-custom-classname': 'off',
      // Class ordering is noisy for the existing codebase; revisit later.
      'tailwindcss/classnames-order': 'off',
    },
    ignores: ['src/vite-env.d.ts'],
  },
];
