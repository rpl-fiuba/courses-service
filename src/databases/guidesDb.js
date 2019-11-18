const createError = require('http-errors');

const { processDbResponse, snakelize, handleConflict } = require('../utils/dbUtils');
const configs = require('../configs')();
const knex = require('knex')(configs.db); // eslint-disable-line
const GUIDES_TABLE = 'guides';

/**
 * Get the guides of a course
 *
 */
const getGuides = async ({
  courseId,
  limit,
  offset,
}) => knex.select()
  .from(GUIDES_TABLE)
  .where(snakelize({ courseId }))
  .offset(offset || configs.dbDefault.offset)
  .limit(limit || configs.dbDefault.limit)
  .then(processDbResponse)
  .then((response) => {
    if (!response.length) {
      return [];
    }
    return response;
  });

/**
 * Add guide into course
 *
 */
const addGuide = async ({ guide }) => knex
  .insert(snakelize(guide))
  .into(GUIDES_TABLE)
  .catch((err) => handleConflict({ err, resourceName: `Guide with id ${guide.guideId}` }));

/**
 * Delete an specific guide
 *
 */
const deleteGuide = async ({
  courseId,
  guideId,
}) => knex(GUIDES_TABLE)
  .delete()
  .where(snakelize({ courseId, guideId }));

/**
 * Update an specific guide
 *
 */
const updateGuide = async ({
  courseId,
  guideId,
  name,
  description
}) => knex(GUIDES_TABLE)
  .update({ name, description })
  .where(snakelize({ courseId, guideId }));

/**
 * Get an specific guide
 *
 */
const getGuide = async ({ courseId, guideId }) => knex(GUIDES_TABLE)
  .select()
  .where(snakelize({ courseId, guideId }))
  .then(processDbResponse)
  .then((response) => {
    if (!response.length) {
      throw new createError.NotFound(`Guide with guideId ${guideId} and courseId ${courseId} not found`);
    }
    return response;
  });

module.exports = {
  getGuides,
  getGuide,
  addGuide,
  deleteGuide,
  updateGuide,
};
