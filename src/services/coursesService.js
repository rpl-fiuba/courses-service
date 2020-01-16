const createError = require('http-errors');
const coursesDb = require('../databases/coursesDb');
const usersService = require('./usersService');
const guidesService = require('./guidesService');

const PROFESSOR_ROLES = ['professor', 'creator'];

/**
 * Get an specific course for the user
 *
 */
const getCourse = async ({ context, courseId, userId }) => {
  const user = await usersService.getUser({ courseId, userId });

  if (!user) {
    return Promise.reject(createError.Forbidden(
      `The user with id ${userId} dont belong to the course with id ${courseId}`
    ));
  }
  const course = await coursesDb.getCourse({ courseId });
  const guides = await guidesService.getGuides({ courseId });
  const users = await usersService.getUsersFromCourse({ context, courseId });
  const professors = users.filter((u) => PROFESSOR_ROLES.includes(u.role));

  return {
    ...course, guides, users, professors
  };
};

/**
 * Get courses by user
 *
 */
const getUserCourses = async ({
  context, page, limit, userId
}) => {
  const courses = await coursesDb.getUserCourses({ page, limit, userId });

  if (!courses.length) {
    return courses;
  }
  return includeProfessorsToCourses({ context, courses });
};

/**
 * Add course
 *
 */
const addCourse = async ({
  context, description, name, password, creatorId
}) => {
  const courseId = name.toLowerCase().replace(' ', '-');

  const createdCourse = await coursesDb.addCourse({
    name, password, description, creatorId, courseId
  });
  const users = [{ ...context.user, role: 'creator' }];

  return {
    ...createdCourse, users, professors: users, guides: []
  };
};

/**
 * Delete course
 *
 */
const deleteCourse = async ({ userId, courseId }) => {
  const isProfessor = await usersService.isProfessor({ userId, courseId });
  if (!isProfessor) {
    return Promise.reject(createError.Forbidden());
  }
  return coursesDb.deleteCourse({ courseId });
};

/**
 * Update course
 *
 */
const updateCourse = async ({
  courseId, userId, metadata
}) => {
  const isProfessor = await usersService.isProfessor({ userId, courseId });
  if (!isProfessor) {
    return Promise.reject(createError.Forbidden());
  }

  return coursesDb.updateCourse({ courseId, metadata });
};

/**
 * Update course
 *
 */
const publishCourse = async ({ courseId, userId }) => {
  const isProfessor = await usersService.isProfessor({ userId, courseId });
  if (!isProfessor) { // TODO: hace falta que sea el creador? publicar guias también?
    return Promise.reject(createError.Forbidden());
  }
  const metadata = { courseStatus: 'published' };

  return coursesDb.updateCourse({ courseId, metadata });
};

/**
 * Search published courses
 *
 */
const searchCourses = async ({
  context, page, limit, search, userId
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
  return includeProfessorsToCourses({ context, courses });
};


const includeProfessorsToCourses = async ({ context, courses }) => {
  const coursesWithProfessors = await coursesDb.includeProfessorsToCourses({ courses });

  const professorIds = coursesWithProfessors.reduce((acum, course) => {
    const profUserIds = course.professors.map((prof) => ({ id: prof.userId }));
    return [...acum, ...profUserIds];
  }, []);

  const allUsers = await usersService.getUsersFromIds({ context, userIds: professorIds });

  return coursesWithProfessors.map((course) => {
    const professors = course.professors.map((profesor) => (
      allUsers.find((user) => user.userId === profesor.userId)
    ));

    return {
      ...course,
      professors
    };
  });
};

module.exports = {
  addCourse,
  getCourse,
  getUserCourses,
  deleteCourse,
  publishCourse,
  searchCourses,
  updateCourse
};
