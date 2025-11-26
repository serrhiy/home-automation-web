'use strict';

const fsp = require('node:fs/promises');
const vm = require('node:vm');

module.exports = (options) => async (filename) => {
  const module = {};
  const source = await fsp.readFile(filename);
  const script = new vm.Script(source);
  const context = vm.createContext({ module });
  return script.runInContext(context, options);
};
