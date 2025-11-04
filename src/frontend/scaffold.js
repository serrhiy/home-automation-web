export default (transport) => {
  const scaffold = (structure, url = '/api') => {
    const api = Object.create(null);
    for (const [service, methods] of Object.entries(structure)) {
      const path = url + '/' + service;
      if (!Array.isArray(methods)) {
        api[service] = scaffold(methods, path);
        continue;
      }
      const functions = Object.create(null);
      for (const method of methods) {
        functions[method] = (data) => transport(path, method, data);
      }
      api[service] = functions;
    }
    return api;
  };
  return scaffold;
};
