const createError = require('http-errors');

const { processDbResponse, snakelize, handleConflict } = require('../utils/dbUtils');
const configs = require('../configs')();
const knex = require('knex')(configs.db); // eslint-disable-line

const COURSE_USERS_TABLE = 'course_users';

/**
 * Get users of the course
 *
 */
const getUsers = async ({ courseId, limit, offset }) => knex(COURSE_USERS_TABLE)
  .select('user_id', 'role')
  .where(snakelize({ courseId }))
  .limit(limit || configs.dbDefault.limit) // TODO: con null funciona?
  .offset(offset || configs.dbDefault.offset)
  .then(processDbResponse)
  .then((response) => {
    if (!response.length) {
      throw new createError.NotFound(`Users not found for course ${courseId}`);
    }
    return response;
  });

/**
 * Get an specific user
 *
 */
const getUser = async ({
  courseId,
  userId
}) => knex(COURSE_USERS_TABLE)
  .select()
  .where(snakelize({ courseId, userId }))
  .then(processDbResponse)
  .then((response) => {
    if (!response.length) {
      throw new createError.NotFound(`User with id ${userId} not found for course ${courseId}`);
    }
    return response[0];
  });

/**
 * Add user to a course
 *
 */
const addUser = async ({ userId, courseId, role }) => knex(COURSE_USERS_TABLE)
  .insert(snakelize({ userId, courseId, role }))
  // TODO: on conflict do nothing
  .catch((err) => handleConflict({ err, resourceName: `User with id ${userId}` }));

/**
 * Delete user from course
 *
 */
const deleteUser = async ({ courseId, userId }) => knex(COURSE_USERS_TABLE)
  .delete()
  .where(snakelize({ courseId, userId }));

/**
 * Update an specific user
 *
 */
const updateUser = async ({ courseId, userId, role }) => knex(COURSE_USERS_TABLE)
  .update({ role })
  .where(snakelize({ courseId, userId }));

module.exports = {
  getUsers,
  getUser,
  addUser,
  deleteUser,
  updateUser,
};
