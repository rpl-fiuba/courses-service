const createError = require('http-errors');
const expressify = require('expressify')();
const guidesService = require('../services/guidesService');

/**
 * Get guides of a course
 *
 */
const getGuides = async (req, res) => {
  const { courseId } = req.params;
  const { limit, offset } = req.query;
  const guides = await guidesService.getGuides({ courseId, limit, offset });
  return res.status(200).json(guides);
};

/**
 * Add a guide to the course
 *
 */
const addGuide = async (req, res) => {
  const { courseId } = req.params;
  const { name, description } = req.body;
  const { userId } = req.context.user;

  if (!name || !description) {
    return Promise.reject(createError.BadRequest('name or description has not been provided'));
  }
  const guide = await guidesService.addGuide({
    courseId, name, description, userId
  });

  return res.status(201).json(guide);
};

/**
 * Delete an specific guide
 *
 */
const deleteGuide = async (req, res) => {
  const { courseId, guideId } = req.params;
  await guidesService.deleteGuide({ guideId, courseId });
  return res.status(204).json({});
};

/**
 * Update an specific guide
 *
 */
const updateGuide = async (req, res) => {
  const { userId } = req.context.user;
  const { courseId, guideId } = req.params;
  const { name, description } = req.body;
  const guide = await guidesService.updateGuide({
    courseId, guideId, name, description, userId
  });
  return res.status(200).json(guide);
};

/**
 * Get an specific guide
 *
 */
const getGuide = async (req, res) => {
  const { courseId, guideId } = req.params;
  const guide = await guidesService.getGuide({ guideId, courseId });
  return res.status(200).json(guide);
};

module.exports = expressify({
  getGuides,
  getGuide,
  addGuide,
  deleteGuide,
  updateGuide,
});
