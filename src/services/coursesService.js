const createError = require('http-errors');
const coursesDb = require('../databases/coursesDb');
const usersService = require('./usersService');
const guidesService = require('./guidesService');

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
  const users = await usersService.getUsersFromCourse({ context, courseId });
  const guides = await guidesService.getGuides({ courseId });

  return { ...course, guides, users };
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

  return createdCourse;
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
  searchCourses,
  updateCourse
};
