const createError = require('http-errors');
const courses = require('../databases/coursesDb');
const usersService = require('./usersService');

const getCourse = async ({ courseId, userId }) => {
  if (await usersService.getUser({ courseId, userId }) === null) {
    return Promise.reject(createError.Forbidden(
      `The user with id ${userId} dont belong to the course with id ${courseId}`
    ));
  }
  return courses.getCourse({ courseId });
};

const courseExists = async ({ courseId }) => courses.getCourse({ courseId })
  .then(() => true)
  .catch(() => false);

const getUserCourses = async ({
  page,
  limit,
  userId
}) => courses.getUserCourses({ page, limit, userId });

const addCourse = async ({ description, name, creatorId }) => {
  // TODO: refactor and think if every user can create courses
  const courseId = name.toLowerCase().replace(' ', '');
  await courses.addCourse({
    name,
    description,
    creatorId,
    courseId,
  });
};

const deleteCourse = async ({ userId, courseId }) => {
  if (!await usersService.isAdmin({ userId, courseId })) {
    return Promise.reject(createError.Forbidden());
  }
  return courses.deleteCourse({ courseId });
};

const updateCourse = async ({
  courseId, userId, description, name
}) => {
  if (!await courseExists({ courseId })) {
    return Promise.reject(createError.NotFound(`Course with id ${courseId} not found`));
  }

  if (!await usersService.isAdmin({ userId, courseId })) {
    return Promise.reject(createError.Forbidden());
  }
  return courses.updateCourse({
    name,
    description,
    courseId,
  });
};

const getCourses = async ({ page, limit }) => courses.getCourses({ offset: page * limit, limit });


module.exports = {
  getCourses,
  getUserCourses,
  addCourse,
  getCourse,
  deleteCourse,
  updateCourse,
  courseExists,
};
