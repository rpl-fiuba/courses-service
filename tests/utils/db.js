const _ = require('lodash');
const configs = require('../../configs');

const knex = require('knex')(configs.db); // eslint-disable-line

const sanitizeResponse = (response) => {
  if (_.isArray(response)) {
    return response.map((obj) => sanitizeResponse(obj));
  }
  delete response.id;
  return response;
};

const cleanDb = async () => {
  await knex('courses').del();
  await knex('guides').del();
  await knex('course_users').del();
};

module.exports = {
  knex,
  cleanDb,
  sanitizeResponse
};
