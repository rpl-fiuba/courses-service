const createError = require('http-errors');
const guidesDb = require('../databases/guidesDb');
const coursesService = require('./coursesService');
const usersService = require('./usersService');

/**
 * Get guides from course
 *
 */
const getGuides = async ({
  courseId,
  limit,
  offset,
}) => guidesDb.getGuides({ courseId, limit, offset });

/**
 * Add a guide to the course
 *
 */
const addGuide = async ({
  courseId,
  name,
  description,
  userId,
}) => {
  const doesCourseExist = await coursesService.doesCourseExists({ courseId });
  if (!doesCourseExist) {
    return Promise.reject(createError.BadRequest(`course with id: ${courseId} does not exist`));
  }

  const hasEditPermission = await usersService.hasEditPermission({ courseId, userId });
  if (!hasEditPermission) {
    return Promise.reject(createError.Forbidden(
      `User with id: ${userId} do not have permission `
      + `to create guides for the course with id ${courseId}`
    ));
  }
  const guideId = name.toLowerCase().replace(' ', '');
  const guide = {
    guideId,
    courseId,
    name,
    description,
  };

  await guidesDb.addGuide({ guide });
  return guide;
};

/**
 * Delete an specific guide
 *
 */
const deleteGuide = async ({
  courseId,
  guideId,
}) => guidesDb.deleteGuide({ courseId, guideId });

/**
 * Update an specific guide
 *
 */
const updateGuide = async ({
  courseId,
  guideId,
  name,
  description,
  userId,
}) => {
  const doesCourseExist = await coursesService.doesCourseExists({ courseId });
  if (!doesCourseExist) {
    return Promise.reject(createError.NotFound(`Course with id: ${courseId} not found`));
  }
  if (!await doesGuideExists({ courseId, guideId })) {
    return Promise.reject(createError.NotFound(
      `Guide with id ${guideId} not found for course with id ${courseId}`
    ));
  }

  const hasEditPermission = await usersService.hasEditPermission({ courseId, userId });
  if (!hasEditPermission) {
    return Promise.reject(createError.Forbidden(
      `User with id: ${userId} do not have permission `
      + `to create guides for the course with id ${courseId}`
    ));
  }

  const guide = {
    courseId,
    guideId,
    name,
    description,
  };

  await guidesDb.updateGuide(guide);
  return guide;
};

/**
 * Get an specific guide
 *
 */
const getGuide = async ({ courseId, guideId }) => guidesDb.getGuide({ courseId, guideId });

const doesGuideExists = async ({ courseId, guideId }) => guidesDb.getGuide({ courseId, guideId })
  .then(() => true)
  .catch(() => false);

module.exports = {
  getGuides,
  getGuide,
  addGuide,
  deleteGuide,
  updateGuide,
};
