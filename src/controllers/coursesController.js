const createError = require('http-errors');
const expressify = require('expressify')();
const logger = require('../utils/logger.js');
const coursesService = require('../services/coursesService')

/**
 * Get courses.
 */
const getCourses = async (req, res) => {
  let page = req.query.page;
  let limit = req.query.limit;

  let courses = await coursesService.getCourses({page, limit})

  return res.status(200).json(courses);
};

const addCourse = async (req, res) => {
  return res.status(200).json({});
}

const updateCourse = async (req, res) => {
  return res.status(200).json({});
}
const updateCourseUsers = async (req, res) => {
  return res.status(200).json({});
}
const getCourseUsers = async (req, res) => {
  return res.status(200).json({});
}
const deleteCourse = async (req, res) => {
  return res.status(200).json({});
}

module.exports = expressify({
  getCourses,
  addCourse,
  updateCourse,
  updateCourseUsers,
  getCourseUsers,
  deleteCourse,
});
