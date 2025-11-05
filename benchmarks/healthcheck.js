'use strict';

module.exports = async (api) => {
  const benchmark = async (requestsNumber) => {
    const promises = [];
    for (let index = 0; index < requestsNumber; index++) {
      promises.push(api.healthcheck.get());
    }
    return Promise.all(promises);
  };

  return { benchmark, clear: () => Promise.resolve() };
};
