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
      console.log(response)
      if (!response) {
        throw new createError.NotFound('Courses not found');
      }
      return response;
    })
    .catch(console.log)
};

const newCourse = ({trx, name, description}) => {
  const id = name.toLowerCase().replace(' ', '');
  return knex('courses')
    .transacting(trx)
    .insert({
      id,
      name,
      description,
    });
}

const createCourseCreator = ({trx, courseId, creatorId}) => {
  return knex('course_users')
    .transacting(trx)
    .insert({
      userId: creatorId,
      courseId,
      role: 'admin'
    })
}

const addCourse = async ({ courseId, name, description, creatorId }) => {

  knex.transaction()
    .then(trx => newCourse({trx, name, description}))
    .then(trx => createCourseCreator({trx, courseId}))
    .then(trx.commit)
    .catch(trx.rollback);// TODO: handle this.
}







module.exports = {
  getCourses
};
