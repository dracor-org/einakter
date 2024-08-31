/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  locales: [
    'en',
    'de',
    'es',
    'fa',
    'fr',
    'ja',
    'ko',
    'ku',
    'ru',
    'uk',
    'zh',
    'jbo-tok',
  ],
  sourceLocale: 'en',
  catalogs: [
    {
      path: '<rootDir>/src/locales/{locale}/messages',
      include: ['src'],
    },
  ],
  format: 'po',
};
