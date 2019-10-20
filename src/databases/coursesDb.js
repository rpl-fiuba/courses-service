const createError = require('http-errors');

const { processDbResponse } = require('../utils/dbUtils');
const configs = require('../../configs');
const knex = require('knex')(configs.db); // eslint-disable-line

const COURSES_TABLE = 'courses';
const COURSE_USERS_TABLE = 'course_users';
/**
 * Get courses.
 *
 */

const getCoursesByUser = async ({
  userId,
  page,
  limit
}) => knex(COURSE_USERS_TABLE)
  .select()
  .where({ user_id: userId })
  .returning('*')
  .offset(page)
  .limit(limit)
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
  page,
  limit
}) => {
  const { pageSize } = configs.coursesConfig.pageSize;
  const offset = limit !== null && limit !== undefined ? limit : pageSize;
  return knex(COURSES_TABLE)
    .select()
    .returning('*')
    .offset(page)
    .limit(offset)
    .then(processDbResponse)
    .then((response) => {
      console.log(response);
      if (!response) {
        throw new createError.NotFound('Courses not found');
      }
      return response;
    });
};

const getCourse = async ({ id }) => knex(COURSES_TABLE)
  .select()
  .where({ id })
  .returning('*')
  .first();

const newCourse = ({
  trx,
  name,
  description,
  courseId,
}) => trx.insert({
  id: courseId,
  name,
  description,
})
  .into('courses');


const createCourseCreator = ({
  trx,
  courseId,
  creatorId,
}) => trx
  .insert({
    user_id: creatorId,
    course_id: courseId,
    role: 'admin'
  }).into('course_users');


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

module.exports = {
  getCourses,
  addCourse,
  getCoursesByUser,
  getCourse,
};
