'use strict';

const init = require('eslint-config-metarhia');

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
];
