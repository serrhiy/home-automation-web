'use strict';

const validate = (data, schema) => {
  if (data === null && 'fields' in schema) {
    return { valid: false, message: 'Body should be empty' };
  }
  for (const [field, rules] of Object.entries(schema.fields ?? {})) {
    if (!rules.optional && !(field in data)) {
      return { valid: false, message: `Field '${field}' is absent` };
    }
    const validationResult = rules.validator(data[field]);
    if (!validationResult.valid) return validationResult;
  }
  return { valid: true };
};

module.exports = { validate };
