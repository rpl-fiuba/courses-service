const createError = require('http-errors');

const { processDbResponse, snakelize, handleConflict } = require('../utils/dbUtils');
const configs = require('../../src/configs')();
const knex = require('knex')(configs.db); // eslint-disable-line


const COURSES_TABLE = 'courses';
const COURSE_USERS_TABLE = 'course_users';
/**
 * Get courses.
 *
 */

const getUserCourses = async ({
  userId,
  page,
  limit
}) => knex
  .select('courses.course_id', 'courses.description', 'courses.name')
  .from(COURSE_USERS_TABLE)
  .where(snakelize({ userId }))
  .leftJoin(COURSES_TABLE, 'courses.course_id', 'course_users.course_id')
  .offset(page || configs.dbDefault.offset)
  .limit(limit || configs.dbDefault.limit)
  .then(processDbResponse)
  .then((response) => {
    if (!response) {
      throw new createError.NotFound('Courses not found');
    }
    if (!response.length) {
      return [response];
    }
    return response;
  });

const getCourses = async ({
  offset,
  limit
}) => knex(COURSES_TABLE)
  .select()
  .returning('*')
  .offset(offset || configs.dbDefault.offset)
  .limit(limit || configs.dbDefault.limit)
  .then(processDbResponse)
  .then((response) => {
    if (!response) {
      throw new createError.NotFound('Courses not found');
    }
    return response;
  });

const getCourse = async ({ courseId }) => knex(COURSES_TABLE)
  .select()
  .where(snakelize({ courseId }))
  .returning('*')
  .first()
  .then(processDbResponse)
  .then((response) => {
    if (!response) {
      throw new createError.NotFound(`Course with id: ${courseId} not found`);
    }
    return response;
  });

const newCourse = ({
  trx,
  name,
  description,
  courseId,
}) => trx.insert(snakelize({
  courseId,
  name,
  description,
}))
  .into(COURSES_TABLE)
  .catch((err) => handleConflict({ err, resourceName: `Course with id ${courseId}` }));


const createCourseCreator = ({
  trx,
  courseId,
  creatorId,
}) => trx
  .insert(snakelize({
    userId: creatorId,
    courseId,
    role: 'admin'
  })).into('course_users');


const addCourse = async ({
  courseId,
  name,
  description,
  creatorId,
}) => {
  const trx = await knex.transaction();
  await newCourse({
    trx,
    name,
    description,
    courseId,
  });
  await createCourseCreator({
    trx,
    courseId,
    creatorId,
  });
  await trx.commit();
};

const deleteCourse = async ({ courseId }) => {
  const trx = await knex.transaction();
  // TODO: delete on cascade?
  await trx.delete()
    .from(COURSES_TABLE)
    .where(snakelize({ courseId }));

  await trx.delete()
    .from(COURSE_USERS_TABLE)
    .where(snakelize({ courseId }));

  await trx.commit();
};

const updateCourse = async ({ courseId, name, description }) => knex(COURSES_TABLE)
  .update({ name, description })
  .where(snakelize({ courseId }));

module.exports = {
  getCourses,
  addCourse,
  getUserCourses,
  getCourse,
  deleteCourse,
  updateCourse,
};
