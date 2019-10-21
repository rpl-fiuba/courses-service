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

const addThreeMocks = async () => {
  await knex('courses').insert([
    {
      id: 'coursename1',
      name: 'course name 1',
      description: 'course description 1',
    },
    {
      id: 'coursename2',
      name: 'course name 2',
      description: 'course description 2',
    },
    {
      id: 'coursename3',
      name: 'course name 3',
      description: 'course description 3',
    },
  ]);
  await knex('course_users').insert([
    {
      course_id: 'coursename2',
      user_id: 'diego',
      role: 'admin'
    },
    {
      course_id: 'coursename1',
      user_id: 'diego',
      role: 'admin'
    },
    {
      course_id: 'coursename3',
      user_id: 'pedro',
      role: 'admin'
    },
    {
      course_id: 'coursename3',
      user_id: 'joaco',
      role: 'student'
    },
  ]);
  await knex('guides').insert([
    {
      course_id: 'coursename',
      guide_id: 'guide id',
      description: 'description',
    },
  ]);
};

module.exports = {
  knex,
  cleanDb,
  sanitizeResponse,
  addThreeMocks,
};
