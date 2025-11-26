'use strict';

const minLengthValidator = (minLength) => (string) => {
  if (string.length < minLength) {
    return { valid: false, message: 'Invalid field length' };
  }
  return { valid: true };
};

const noValidation = () => ({ valid: true });

module.exports = {
  create: {
    fields: {
      publicKey: {
        type: 'string',
        optional: false,
        validator: noValidation,
      },
      label: {
        type: 'string',
        optional: false,
        validator: minLengthValidator(3),
      },
    },
    order: ['publicKey', 'label'],
  },
};
