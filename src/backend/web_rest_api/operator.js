'use strict';

module.exports = ({ repository, utils }) => ({
  create: async (publicKey, label, cookies) => {
    if (await repository.operators.exists(label)) {
      throw Error('Such operator already exists!');
    }
    const token = utils.generateToken();
    cookies.set('token', token);
    return repository.operators.create(label, publicKey, token);
  },
});
