'use strict';

const config = require('./config.json');
const db = require('knex')(config.database);
const loader = require('./load.js')(config.sandbox);
const path = require('node:path');
const repository = require('./repositories/PostgresDB.js')(db);
const Router = require('./routers/FSRouter.js');
const validator = require('./validator/SchemaValidator.js');
const crypto = require('node:crypto');

const webRestApiPath = path.join(__dirname, 'web_rest_api');

const utils = { generateToken: crypto.randomUUID };
const sandbox = { repository, utils };

const main = async () => {
  const router = await new Router(webRestApiPath, loader, sandbox);
  const { schema, endpoint } = router.getController('/operator', 'create');
  const data = { label: 'label', publicKey: 'publicKey' };
  console.log(validator.validate(data, schema), endpoint);
};

main().finally(db.destroy.bind(db));
