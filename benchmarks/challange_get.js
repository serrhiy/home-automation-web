'use strict';

module.exports = (api) => {
  const benchmark = (requestsNumber) => {
    const promises = [];
    for (let index = 0; index < requestsNumber; index++) {
      promises.push(api.challange.get());
    }
    return Promise.all(promises);
  };

  return { benchmark, clear: () => Promise.resolve() };
};
