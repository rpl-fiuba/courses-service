const createError = require('http-errors');

const { processDbResponse, snakelize, handleConflict } = require('../utils/dbUtils');
const configs = require('../configs')();
const knex = require('knex')(configs.db); // eslint-disable-line

const COURSE_USERS_TABLE = 'course_users';

const getUsers = async ({ courseId, limit, offset }) => knex
  .select()
  .from(COURSE_USERS_TABLE)
  .where(snakelize({ courseId }))
  .limit(limit || configs.dbDefault.limit)
  .offset(offset || configs.dbDefault.offset)
  .then(processDbResponse)
  .then((response) => {
    if (!response) {
      throw new createError.NotFound(`Users not found for course ${courseId}`);
    }
    return response;
  });

const getUser = async ({
  courseId,
  userId
}) => knex.select()
  .from(COURSE_USERS_TABLE)
  .where(snakelize({ courseId, userId }))
  .then(processDbResponse)
  .then((response) => {
    if (!response) {
      throw new createError.NotFound(`User with id ${userId} not found for course ${courseId}`);
    }
    return response;
  });


const addUser = async ({ userId, courseId, role }) => knex(COURSE_USERS_TABLE)
  .insert(snakelize({
    userId,
    courseId,
    role,
  }))
  .catch((err) => handleConflict({ err, resourceName: `User with id ${userId}` }));

const deleteUser = async ({ courseId, userId }) => knex.delete()
  .from(COURSE_USERS_TABLE)
  .where(snakelize({ courseId, userId }));

const updateUser = async ({ courseId, userId, role }) => knex
  .update({ role })
  .from(COURSE_USERS_TABLE)
  .where(snakelize({ courseId, userId }));

module.exports = {
  getUsers,
  getUser,
  addUser,
  deleteUser,
  updateUser,
};
