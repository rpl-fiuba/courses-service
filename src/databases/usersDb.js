const createError = require('http-errors');

const { processDbResponse, snakelize } = require('../utils/dbUtils');
const configs = require('../../configs');
const knex = require('knex')(configs.db); // eslint-disable-line

/**
 * Get user.
 *
 */
const getUser = async ({ userId }) => (
  knex('users')
    .select()
    .where('user_id', userId)
    .returning('*')
    .then(processDbResponse)
    .then((response) => {
      if (!response) {
        throw new createError.NotFound('User not found');
      }
      return response;
    })
);

/**
 * Create user.
 *
 */
const createUser = async ({ userMetadata }) => (
  knex('users')
    .insert(snakelize(userMetadata))
    .returning('*')
    .then(processDbResponse)
    .catch((err) => {
      if (err.code === '23505') {
        throw new createError.Conflict('User already exists');
      }
      throw err;
    })
);

module.exports = {
  getUser,
  createUser
};
