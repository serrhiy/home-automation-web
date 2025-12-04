'use strict';

const crypto = require('node:crypto');
const util = require('node:util');

const CHALLANGE_BYTES = 128;
const randomBytes = util.promisify(crypto.randomBytes);

module.exports = () => ({
  get: () =>
    randomBytes(CHALLANGE_BYTES).then((buffer) => buffer.toString('hex')),
});
