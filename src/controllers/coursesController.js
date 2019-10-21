const createError = require('http-errors');
const expressify = require('expressify')();
// const logger = require('../utils/logger.js');
const coursesService = require('../services/coursesService');

/**
 * Get courses.
 */
const getCourses = async (req, res) => {
  let { page, limit } = req.query;
  const { authorization } = req.headers;

  // TODO: default values
  page = !page ? 0 : page;
  limit = !limit ? 10 : limit;

  if (!authorization) {
    return Promise.reject(createError.Unauthorized());
  }

  const courses = await coursesService.getCourses({ page, limit, userToken: authorization });

  return res.status(200).json(courses);
};

const getCourse = async (req, res) => res.status(200)
  .json(await coursesService.getCourse({ id: req.params.courseId }));


const addCourse = async (req, res) => {
  const { authorization } = req.headers;
  const { name, description } = req.body;
  // TODO: validar el rol del usuario.

  if (!authorization) {
    return Promise.reject(createError.Unauthorized());
  }

  if (!name || !description) {
    return Promise.reject(createError.BadRequest('name or description have not been provided'));
  }

  const creatorId = authorization;
  await coursesService.addCourse({
    name,
    description,
    creatorId,
  });

  return res.status(201).json({});
};

// const updateCourse = async (req, res) => {
//   return res.status(200).json({});
// };

const addUserToCourse = async (req, res) => {
  const { courseId, userId } = req.body;
  const { authorization } = req.headers;

  if (!authorization) {
    return Promise.reject(createError.Unauthorized());
  }

  if (!courseId || !userId) {
    return Promise.reject(createError.BadRequest('courseId or userId not provided'));
  }

  await coursesService.addUserToCourse({ userId, courseId });

  return res.status(201).json({});
};

// const getCourseUsers = async (req, res) => {
//   return res.status(200).json({});
// };

// const deleteCourse = async (req, res) => {
//   return res.status(200).json({});
// };

module.exports = expressify({
  getCourses,
  addCourse,
  getCourse,
  addUserToCourse,
  // updateCourse,
  // updateCourseUsers,
  // getCourseUsers,
  // deleteCourse,
});
