'use strict';

const pipe =
  (...validators) =>
  (value) => {
    for (const validator of validators) {
      const result = validator(value);
      if (!result.valid) return result;
    }
    return { valid: true };
  };

const isString = (string) => {
  if (typeof string === 'string') return { valid: true };
  return { valid: false, message: 'Invalid field type, must be string' };
};

const minLengthValidator = (minLength) => (string) => {
  if (string.length < minLength) {
    return { valid: false, message: 'Invalid field length' };
  }
  return { valid: true };
};

module.exports = {
  create: {
    needToken: false,
    fields: {
      publicKey: {
        optional: false,
        validator: isString,
      },
      label: {
        optional: false,
        validator: pipe(isString, minLengthValidator(3)),
      },
    },
    order: ['publicKey', 'label'],
  },
};
