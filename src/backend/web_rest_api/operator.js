'use strict';

module.exports = ({ repository, utils }) => ({
  create: async (publicKey, label) => {
    if (await repository.operators.exists(label)) {
      throw Error('Such operator already exists!');
    }
    const token = utils.generateToken();
    return repository.operators.create(label, publicKey, token);
  },
});
