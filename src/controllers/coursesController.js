const createError = require('http-errors');
const expressify = require('expressify')();
// const logger = require('../utils/logger.js');
const coursesService = require('../services/coursesService');

const getCourses = async (req, res) => {
  const { page, limit } = req.query;
  const { userId } = req.context.user;

  const courses = await coursesService.getCourses({ page, limit, userId });

  return res.status(200).json(courses);
};

const getCourse = async (req, res) => {
  const { courseId } = req.params;
  const { userId } = req.context.user;

  const course = await coursesService.getCourse({ courseId, userId });

  if (!course) {
    return Promise.reject(createError.NotFound(`Course with id: ${courseId}`));
  }

  return res.status(200).json(course);
};

const addCourse = async (req, res) => {
  const { userId } = req.context.user;
  const { name, description } = req.body;
  // TODO: validar el rol del usuario.

  if (!name || !description) {
    return Promise.reject(createError.BadRequest('name or description have not been provided'));
  }

  const creatorId = userId;
  await coursesService.addCourse({
    name,
    description,
    creatorId,
  });

  return res.status(201).json({});
};

const deleteCourse = async (req, res) => {
  const { userId } = req.context.user;
  const { courseId } = req.params;

  if (!courseId) {
    return Promise.reject(createError.BadRequest('course id not provided'));
  }
  await coursesService.deleteCourse({ courseId, userId });

  return res.status(200).json({});
};

const updateCourse = async (req, res) => {
  const { userId } = req.context.user;
  const { courseId } = req.params;
  const { name, description } = req.body;

  if (!courseId || !name || !description) {
    return Promise.reject(createError.BadRequest('course id, name or description not provided'));
  }

  await coursesService.updateCourse({
    courseId, name, description, userId
  });

  return res.status(200).json({});
};

const getUserCourses = async (req, res) => {
  const { userId } = req.context.user;
  const { page, limit } = req.query;
  const userCourses = await coursesService.getUserCourses({ page, limit, userId });
  return res.status(200).json(userCourses);
};


module.exports = expressify({
  getCourses,
  addCourse,
  getCourse,
  updateCourse,
  deleteCourse,
  getUserCourses,
});
