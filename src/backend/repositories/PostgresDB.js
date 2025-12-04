'use strict';

const billingPlanIdToEndedTime = (db, planId) => {
  const map = {
    1: () => db.raw(`'infinity'::timestamp`),
    2: () => db.raw(`NOW() + INTERVAL '1 month'`),
    3: () => db.raw(`NOW() + INTERVAL '3 months'`),
    4: () => db.raw(`NOW() + INTERVAL '1 year'`),
  };
  if (planId in map) return map[planId]();
  throw new Error(`Unfamiliar plan id: ${planId}`);
};

module.exports = (db) => {
  const billingPlans = {
    getBillingPlans: () => db.select('*').from('billingPlans'),
    getFreePlan: () =>
      db.select('*').from('billingPlans').where({ price: 0 }).first(),
  };

  const billingPlanInfo = {
    create: (billingPlanId) => {
      const endedAt = billingPlanIdToEndedTime(db, billingPlanId);
      const fields = { billingPlanId, endedAt };
      const pr = db.insert(fields).into('billingPlanInfo').returning('id');
      return pr.then(([{ id }]) => id);
    },
  };

  const operators = {
    exists: (label) => {
      const promise = db.select('id').from('operators').where({ label });
      return promise.then((result) => result.length !== 0);
    },

    existsToken: (token) => {
      const promise = db.select('id').from('operators').where({ token });
      return promise.then((result) => result.length !== 0);
    },

    create: async (label, publicKey, token, billingPlanId) => {
      const billing = billingPlanId ?? (await billingPlans.getFreePlan()).id;
      const planInfoId = await billingPlanInfo.create(billing);
      const fields = { label, planInfoId, token, publicKey };
      const promise = db.insert(fields).into('operators').returning('*');
      return promise.then(([operator]) => operator);
    },
  };

  return { billingPlans, operators, billingPlanInfo };
};
