'use strict';

const fsp = require('node:fs/promises');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const { pathToFileURL } = require('url');

module.exports = (options) => async (filename) => {
  const module = {};
  const fileurl = pathToFileURL(filename);
  const sandbox = { module, require: createRequire(fileurl) };
  const source = await fsp.readFile(filename);
  const script = new vm.Script(source);
  const context = vm.createContext(sandbox);
  return script.runInContext(context, options);
};
