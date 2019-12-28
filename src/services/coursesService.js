const createError = require('http-errors');
const coursesDb = require('../databases/coursesDb');
const usersService = require('./usersService');

/**
 * Get an specific course for the user
 *
 */
const getCourse = async ({ courseId, userId }) => {
  const user = await usersService.getUser({ courseId, userId });

  if (!user) {
    return Promise.reject(createError.Forbidden(
      `The user with id ${userId} dont belong to the course with id ${courseId}`
    ));
  }
  // TODO: Estaria bueno que la query incluya las guias
  const course = await coursesDb.getCourse({ courseId });
  const coursesWithProfessors = await coursesDb.includeProfessorsToCourses({ courses: [course] });
  const withProfessorsAndGuides = await coursesDb.includeGuidesToCourses({
    courses: coursesWithProfessors,
  });

  return withProfessorsAndGuides[0];
};

/**
 * Get courses by user
 *
 */
const getUserCourses = async ({
  page,
  limit,
  userId
}) => {
  const courses = await coursesDb.getUserCourses({ page, limit, userId });

  if (!courses.length) {
    return courses;
  }
  return coursesDb.includeProfessorsToCourses({ courses });
};

/**
 * Add course
 *
 */
const addCourse = async ({
  description, name, password, creatorId
}) => {
  const courseId = name.toLowerCase().replace(' ', '-');

  const createdCourse = await coursesDb.addCourse({
    name,
    password,
    description,
    creatorId,
    courseId,
  });

  const coursesWithProfessors = await coursesDb.includeProfessorsToCourses({
    courses: [createdCourse]
  });

  return coursesWithProfessors[0];
};

/**
 * Delete course
 *
 */
const deleteCourse = async ({ userId, courseId }) => {
  const isCreator = await usersService.isCreator({ userId, courseId });
  if (!isCreator) {
    return Promise.reject(createError.Forbidden());
  }
  return coursesDb.deleteCourse({ courseId });
};

/**
 * Update course
 *
 */
const updateCourse = async ({
  courseId, userId, description, name
}) => {
  if (!await doesCourseExists({ courseId })) {
    return Promise.reject(createError.NotFound(`Course with id ${courseId} not found`));
  }

  const isCreator = await usersService.isCreator({ userId, courseId });
  if (!isCreator) {
    return Promise.reject(createError.Forbidden());
  }
  return coursesDb.updateCourse({
    name,
    description,
    courseId,
  });
};

/**
 * Search published courses
 *
 */
const searchCourses = async ({
  page, limit, search, userId
}) => {
  const courses = await coursesDb.searchCourses({
    offset: page * limit,
    limit,
    search,
    userId
  });

  if (!courses.length) {
    return courses;
  }
  return coursesDb.includeProfessorsToCourses({ courses });
};


const doesCourseExists = async ({ courseId }) => coursesDb.getCourse({ courseId })
  .then(() => true)
  .catch(() => false);


module.exports = {
  addCourse,
  doesCourseExists,
  getCourse,
  getUserCourses,
  deleteCourse,
  searchCourses,
  updateCourse
};
