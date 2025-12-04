'use strict';

const crypto = require('node:crypto');
const util = require('node:util');

const CHALLANGE_BYTES = 128;
const randomBytes = util.promisify(crypto.randomBytes);

const generateUniqueToken = (ttlMap, tokenGenerator) => {
  const token = tokenGenerator();
  if (!ttlMap.has(token)) return token;
  return generateUniqueToken(ttlMap, tokenGenerator);
};

module.exports = ({ ttlMap, utils }) => ({
  get: async () => {
    const bytes = await randomBytes(CHALLANGE_BYTES);
    const challange = bytes.toString('base64');
    const token = generateUniqueToken(ttlMap, utils.generateToken);
    ttlMap.set(token, bytes);
    return { token, challange };
  },
});
