const createError = require('http-errors');

const { processDbResponse, snakelize } = require('../utils/dbUtils');
const configs = require('../../configs');
const knex = require('knex')(configs.db); // eslint-disable-line

/**
 * Get courses.
 *
 */
const getCourses = async ({ page, limit }) => {

  let pageSize = configs.coursesConfig.pageSize;

  return knex('courses')
    .select()
    .returning('*')
    .then(processDbResponse)
    .then((response) => {
      console.log(response);
      if (!response) {
        throw new createError.NotFound('Courses not found');
      }
      return response;
    })
    .catch(console.log);
};

const newCourse = ({ trx, name, description }) => {
  const id = name.toLowerCase().replace(' ', '');
  return trx.insert({
    id,
    name,
    description,
  }).into('courses');
};


const createCourseCreator = ({
  trx,
  courseId,
  creatorId,
}) => trx
  .insert({
    userId: creatorId,
    courseId,
    role: 'admin'
  }).into('course_users');


const addCourse = async ({
  courseId,
  name,
  description,
  creatorId,
}) => {
  const trx = await knex.transaction();
  newCourse({ trx, name, description })
    .then(() => createCourseCreator({ trx, courseId, creatorId }));
};

module.exports = {
  getCourses
};
