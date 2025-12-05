'use strict';

const config = require('../src/backend/config.json');
const knex = require('knex')(config.database);
const util = require('node:util');
const fs = require('node:fs/promises');
const path = require('node:path');
const { REQUESTS_NUMBER, CONCURRENCY_LEVEL, api } = require('./utils.js');

const NOT_BENCHMARK_FILES = ['main.js', 'utils.js'];

const baseConfig = {
  strict: true,
  allowPositionals: false,
  allowNegative: false,
  tokens: false,
};

const buildParseConfigOptions = async () => {
  const readdirOptions = { withFileTypes: true, recursive: false };
  const entries = await fs.readdir(__dirname, readdirOptions);
  const options = {};
  for (const entry of entries) {
    if (!entry.isFile() || NOT_BENCHMARK_FILES.includes(entry.name)) {
      continue;
    }
    const { name } = path.parse(entry.name);
    options[name] = { type: 'boolean', multiple: false, default: true };
  }
  return options;
};

const makeEnttityBenchmark = async (benchmark, name) => {
  const header = name + ' requests number';
  let requestsNumber = 0;
  while (requestsNumber < REQUESTS_NUMBER) {
    const reminder = REQUESTS_NUMBER - requestsNumber;
    const toRequest = Math.min(reminder, CONCURRENCY_LEVEL);
    await benchmark(toRequest);
    requestsNumber += toRequest;
    console.log(`${header}: ${requestsNumber}/${REQUESTS_NUMBER}`);
  }
};

const clearDatabase = (clear, name) => {
  const promises = [];
  let requestsNumber = 0;
  while (requestsNumber < REQUESTS_NUMBER) {
    const reminder = REQUESTS_NUMBER - requestsNumber;
    const toRequest = Math.min(reminder, CONCURRENCY_LEVEL);
    requestsNumber += toRequest;
    promises.push(clear(toRequest));
  }
  const message = name + ' clearing done';
  return Promise.all(promises).finally(() => console.log(message));
};

const main = async () => {
  const options = await buildParseConfigOptions();
  const parseConfig = { ...baseConfig, options };

  const { values } = util.parseArgs(parseConfig);

  for (const [benchmarkName, run] of Object.entries(values)) {
    if (!run) continue;
    const filename = path.join(__dirname, benchmarkName + '.js');
    const { benchmark, clear } = await require(filename)(api, knex);
    await makeEnttityBenchmark(benchmark, benchmarkName).then(() =>
      clearDatabase(clear, benchmarkName),
    );
  }
};

main().finally(knex.destroy.bind(knex));
