const _ = require('lodash');
const createError = require('http-errors');

const { processDbResponse, snakelize, handleConflict } = require('../utils/dbUtils');
const configs = require('../../src/configs')();
const knex = require('knex')(configs.db); // eslint-disable-line

const COURSES_TABLE = 'courses';
const COURSE_USERS_TABLE = 'course_users';

const VISIBLE_FIELDS_TO_RETURN = [
  'course_id',
  'name',
  'course_status',
  'description',
  'created_at'
];

/**
 * Get courses by user
 *
 */
const getUserCourses = async ({
  userId,
  page,
  limit
}) => knex
  .select()
  .from(COURSE_USERS_TABLE)
  .where(snakelize({ userId }))
  .leftJoin(COURSES_TABLE, 'courses.course_id', 'course_users.course_id')
  .offset(page || configs.dbDefault.offset)
  .limit(limit || configs.dbDefault.limit)
  .orderBy('created_at', 'desc')
  .then(processDbResponse)
  .then((response) => {
    if (!response) {
      return [];
    }
    return response;
  });

/**
 * Search published courses.
 *  - If the userId is present, then the users courses will be excluded
 *
 */
const searchCourses = async ({
  offset,
  limit,
  search,
  userId
}) => knex(COURSES_TABLE)
  .select(VISIBLE_FIELDS_TO_RETURN)
  .where('course_status', 'published')
  .modify((queryBuilder) => {
    if (userId) {
      queryBuilder.whereNotExists(function filter() {
        this.select()
          .from(COURSE_USERS_TABLE)
          .where('user_id', userId)
          .whereRaw('course_users.course_id = courses.course_id');
      });
    }
    if (search) {
      queryBuilder.whereRaw('lower(name) ~ lower(?)', search);
    }
  })
  .offset(offset || configs.dbDefault.offset)
  .limit(limit || configs.dbDefault.limit)
  .orderBy('created_at', 'desc')
  .then(processDbResponse)
  .then((response) => {
    if (!response) {
      return [];
    }
    return response;
  });

/**
 * Get an specific course
 *
 */
const getCourse = async ({ courseId }) => knex(COURSES_TABLE)
  .select()
  .where(snakelize({ courseId }))
  .then(processDbResponse)
  .then((response) => {
    if (!response.length) {
      throw new createError.NotFound(`Course with id: ${courseId} not found`);
    }
    return response[0];
  });

/**
 * Add new course
 *
 */
const addCourse = async ({
  courseId,
  name,
  password,
  description,
  creatorId,
}) => {
  const trx = await knex.transaction();
  const createdCourse = await insertNewCourse({
    trx,
    name,
    password,
    description,
    courseId,
  });
  await createCourseCreator({
    trx,
    courseId,
    creatorId,
  });
  await trx.commit();

  return {
    ...createdCourse[0],
    role: 'creator',
    userId: creatorId
  };
};

/**
 * Delete an specific course
 *
 */
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

/**
 * Update an specific course
 *
 */
const updateCourse = async ({ courseId, name, description }) => knex(COURSES_TABLE)
  .update({ name, description })
  .where(snakelize({ courseId }))
  .returning('*')
  .then(processDbResponse);

/**
 * Given some courses, the professors are added to them
 *
 */
const includeProfessorsToCourses = async ({ courses }) => {
  const courseIds = courses.map((course) => course.courseId);

  const allProfessors = await knex(COURSE_USERS_TABLE)
    .select()
    .whereIn('role', ['professor', 'creator'])
    .whereIn('course_id', courseIds)
    .then(processDbResponse);

  const professorsByCourse = _.groupBy(allProfessors, 'courseId');

  return courses.map((course) => ({
    ...course,
    professors: professorsByCourse[course.courseId]
  }));
};

/**
 * Inserts a new course
 *
 */
const insertNewCourse = ({
  trx,
  name,
  password,
  description,
  courseId,
}) => trx
  .insert(snakelize({
    courseId, name, description, password
  }))
  .into(COURSES_TABLE)
  .returning('*')
  .then(processDbResponse)
  .catch((err) => handleConflict({ err, resourceName: `Course with id ${courseId}` }));

const createCourseCreator = ({
  trx,
  courseId,
  creatorId,
}) => trx
  .insert(snakelize({ userId: creatorId, courseId, role: 'creator' }))
  .into('course_users');


module.exports = {
  addCourse,
  getUserCourses,
  getCourse,
  deleteCourse,
  includeProfessorsToCourses,
  searchCourses,
  updateCourse,
};
