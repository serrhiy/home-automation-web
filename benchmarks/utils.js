'use strict';

const REQUESTS_NUMBER = 10_000;
const CONCURRENCY_LEVEL = 100;
const BASE_URL = 'http://localhost:8080/api';

const structure = {
  operators: ['create', 'authenticate'],
  healthcheck: ['get'],
  challange: ['get'],
};

const transport = async (url, method, data) => {
  const body = JSON.stringify({ data, method });
  const options = { method: 'post', body };
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(response.statusText);
  const json = await response.json();
  if (!json.ok) throw new Error(json.message);
  return json.data;
};

const scaffold = (transport) => {
  const scaffold = (structure, url = BASE_URL) => {
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

module.exports = {
  api: scaffold(transport)(structure),
  REQUESTS_NUMBER,
  CONCURRENCY_LEVEL,
};
