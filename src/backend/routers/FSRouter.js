'use strict';

const path = require('node:path');
const fsp = require('node:fs/promises');

const toBool = [() => true, () => false];

const exists = (file) => fsp.access(file).then(...toBool);

const findServicesFiles = async (root, parent = '/', paths = new Map()) => {
  const files = await fsp.readdir(root, { withFileTypes: true });
  for (const file of files) {
    if (file.name.endsWith('.schema.js')) {
      continue;
    }
    const fullpath = path.join(root, file.name);
    if (file.isDirectory()) {
      await findServicesFiles(fullpath, file.name, paths);
      continue;
    }
    const { name: filenameNoExt } = path.parse(file.name);
    const endpoint = path.join(parent, filenameNoExt);
    const schemapath = path.join(file.parentPath, `${filenameNoExt}.schema.js`);
    const schemaExists = await exists(schemapath);
    if (!schemaExists) {
      throw Error(`Schema ${schemapath} does not exist!`);
    }
    paths.set(endpoint, { service: fullpath, schema: schemapath });
  }
  return paths;
};

const loadServices = async (root, loader) => {
  const paths = await findServicesFiles(root);
  const promises = [];
  for (const [endpoint, { service, schema }] of paths) {
    const subpromises = [loader(service), loader(schema)];
    const promise = Promise.all(subpromises).then((result) => [
      endpoint,
      { serviceFactory: result[0], schema: result[1] },
    ]);
    promises.push(promise);
  }
  const results = await Promise.all(promises);
  return new Map(results);
};

const getServices = async (root, loader, sandbox) => {
  const services = await loadServices(root, loader);
  const routes = new Map();
  for (const [endpoint, { serviceFactory, schema }] of services) {
    const methods = new Map(Object.entries(serviceFactory(sandbox)));
    const data = new Map();
    for (const [methodName, method] of methods) {
      if (methodName in schema) {
        data.set(methodName, { endpoint: method, schema: schema[methodName] });
        continue;
      }
      throw Error(`Schema ${methodName} does not exists!`);
    }
    routes.set(endpoint, data);
  }
  return routes;
};

class Router {
  #services = new Map();

  constructor(root, loader, sandbox) {
    const { promise, resolve, reject } = Promise.withResolvers();
    getServices(root, loader, sandbox)
      .then((services) => {
        this.#services = services;
        resolve(this);
      })
      .catch(reject);
    return promise;
  }

  exists(service, endpoint) {
    if (!this.#services.has(service)) return false;
    return this.#services.get(service).has(endpoint);
  }

  getController(service, endpoint) {
    if (!this.exists(service, endpoint)) return null;
    return this.#services.get(service).get(endpoint);
  }
}

module.exports = Router;
