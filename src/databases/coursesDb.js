const createError = require('http-errors');

const { processDbResponse, snakelize } = require('../utils/dbUtils');
const configs = require('../../configs');
const knex = require('knex')(configs.db); // eslint-disable-line

/**
 * Get courses.
 *
 */
const getCourses = async ({ pageNumber }) => {
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


module.exports = {
  getCourses
};
