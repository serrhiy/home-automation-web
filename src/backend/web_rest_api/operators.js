'use strict';

const crypto = require('node:crypto');
const util = require('node:util');
const { Buffer } = require('node:buffer');

const verify = util.promisify(crypto.verify);

module.exports = ({ repository, utils, ttlMap }) => ({
  create: async (publicKey, label, cookies) => {
    if (await repository.operators.exists(label)) {
      throw Error('Such operator already exists!');
    }
    const token = utils.generateToken();
    cookies.set('token', token);
    return repository.operators.create(label, publicKey, token);
  },

  authenticate: async (label, token, solution, cookies) => {
    if (!ttlMap.has(token)) {
      throw new Error('No such token, try again');
    }
    const operator = await repository.operators.get({ label });
    if (!operator) {
      throw new Error('No operator with such label');
    }
    const challange = ttlMap.get(token);
    const signature = Buffer.from(solution, 'base64');
    const valid = await verify(null, challange, operator.publicKey, signature);
    if (!valid) {
      throw new Error('Invalid signature');
    }
    const operatorsToken = utils.generateToken();
    await repository.operators.update(operator.id, { token: operatorsToken });
    cookies.set('token', operatorsToken);
    return { success: true };
  },
});
