'use strict';

const config = require('./config.json');
const db = require('knex')(config.database);
const loader = require('./load.js')(config.sandbox);
const path = require('node:path');
const repository = require('./repositories/PostgresDB.js')(db);
const Router = require('./routers/FSRouter.js');
const validator = require('./validator/SchemaValidator.js');
const crypto = require('node:crypto');
const WebTransport = require('./transport/WebTransport.js');
const webEngine = require('./webEngine.js');
const Repository = require('./repositories/PostgresDB.js');
const TTLMap = require('./repositories/TTLMap.js');

const webRestApiPath = path.join(__dirname, 'web_rest_api');

const utils = { generateToken: crypto.randomUUID };

const main = async () => {
  const ttlMap = new TTLMap(config.ttlStorage);
  const sandbox = { repository, utils, ttlMap };
  const webRouter = await new Router(webRestApiPath, loader, sandbox, '/api');
  await using webTransport = await new WebTransport(config.webTransport);
  await webEngine(webRouter, validator, webTransport, Repository);
};

main().finally(db.destroy.bind(db));
