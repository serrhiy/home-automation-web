'use strict';

const init = require('eslint-config-metarhia');
const globals = require('globals');

module.exports = [
  ...init,
  {
    files: ['test/**/*.js'],
    rules: {
      strict: 'off',
      camelcase: 'off',
    },
    languageOptions: {
      globals: {
        application: true,
        lib: true,
      },
    },
  },
  {
    files: ['src/frontend/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        myCustomGlobal: 'readonly',
      },
    },
  },
];
