const createError = require('http-errors');
const expressify = require('expressify')();
const coursesService = require('../services/coursesService');

/**
 * Search published courses
 *
 */
const searchCourses = async (req, res) => {
  const { page, limit } = req.query;
  const { userId } = req.context.user;

  const courses = await coursesService.searchCourses({ page, limit, userId });

  return res.status(200).json(courses);
};

/**
 * Get an specific course
 *
 */
const getCourse = async (req, res) => {
  const { courseId } = req.params;
  const { userId } = req.context.user;

  const course = await coursesService.getCourse({ courseId, userId });

  return res.status(200).json(course);
};

/**
 * Create a course
 *
 */
const addCourse = async (req, res) => {
  const { userId } = req.context.user;
  const { name, description } = req.body;

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

/**
 * Delete an specific course
 *
 */
const deleteCourse = async (req, res) => {
  const { userId } = req.context.user;
  const { courseId } = req.params;

  await coursesService.deleteCourse({ courseId, userId });

  return res.status(204).json({});
};

const updateCourse = async (req, res) => {
  const { userId } = req.context.user;
  const { courseId } = req.params;
  const { name, description } = req.body;

  if (!name || !description) {
    return Promise.reject(createError.BadRequest('name or description not provided'));
  }

  const updatedCourse = await coursesService.updateCourse({
    courseId, name, description, userId
  });

  return res.status(200).json(updatedCourse);
};

/**
 * Get courses by user
 *
 */
const getUserCourses = async (req, res) => {
  const { userId } = req.context.user;
  const { page, limit } = req.query;
  const userCourses = await coursesService.getUserCourses({ page, limit, userId });

  return res.status(200).json(userCourses);
};


module.exports = expressify({
  addCourse,
  getCourse,
  searchCourses,
  updateCourse,
  deleteCourse,
  getUserCourses,
});
