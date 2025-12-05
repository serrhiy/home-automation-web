'use strict';

const crypto = require('node:crypto');
const util = require('node:util');

const randomBytes = util.promisify(crypto.randomBytes);

const PUBLIC_KEY_LENGTH = 2048;

const toHex = (buffer) => buffer.toString('hex');

module.exports = async (api, knex) => {
  const labels = [];

  const publicKey = await randomBytes(PUBLIC_KEY_LENGTH).then(toHex);

  const onSuccess = ({ label }) => labels.push(label);
  const onError = console.error;

  const benchmark = (requestsNumber) => {
    const promises = [];
    for (let index = 0; index < requestsNumber; index++) {
      const label = crypto.randomUUID().replaceAll('-', '');
      const data = { publicKey, label };
      const promise = api.operators.create(data).then(onSuccess, onError);
      promises.push(promise);
    }
    return Promise.all(promises);
  };

  const clear = (itemsNumber) => {
    const toDelete = Math.min(itemsNumber, labels.length);
    const items = labels.splice(0, toDelete);
    return knex('operators').whereIn('label', items).delete();
  };

  return { benchmark, clear };
};
