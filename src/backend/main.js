'use strict';

const config = require('./config.json');
const db = require('knex')(config.database);

const main = async () => {
  const result = await db.select('*').from('billing_plans');
  console.log(result);
};

main().finally(db.destroy.bind(db));
