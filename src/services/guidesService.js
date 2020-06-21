const createError = require('http-errors');
const guidesDb = require('../databases/guidesDb');
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
 * Copy course
 *
 */
const copyCourse = async ({ sourceCourseId, targetCourseId }) => {
  const sourceGuides = await guidesDb.getGuides({ courseId: sourceCourseId });
  const targetGuides = sourceGuides.map((guide) => ({
    name: guide.name,
    description: guide.description,
    guideStatus: guide.guideStatus,
    guideId: guide.guideId,
    courseId: targetCourseId
  }));

  return guidesDb.addGuides({ guides: targetGuides });
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
  addGuide,
  copyCourse,
  getGuides,
  getGuide,
  deleteGuide,
  updateGuide,
};
