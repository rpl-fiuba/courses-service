const createError = require('http-errors');

const { processDbResponse, snakelize, handleConflict } = require('../utils/dbUtils');
const configs = require('../configs')();
const knex = require('knex')(configs.db); // eslint-disable-line
const GUIDES_TABLE = 'guides';

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
    if (!response) {
      throw new createError.NotFound('Courses not found');
    }
    if (!response.length) {
      return [response];
    }
    return response;
  });


const addGuide = async ({ guide }) => knex.insert(snakelize(guide))
  .into(GUIDES_TABLE)
  .catch((err) => handleConflict({ err, resourceName: `Guide with id ${guide.guideId}` }));

const deleteGuide = async ({
  courseId,
  guideId,
}) => knex.delete()
  .from(GUIDES_TABLE)
  .where(snakelize({ courseId, guideId }));

const updateGuide = async ({
  courseId,
  guideId,
  name,
  description
}) => knex.update({ name, description })
  .from(GUIDES_TABLE)
  .where(snakelize({ courseId, guideId }));

const getGuide = async ({ courseId, guideId }) => knex.select()
  .from(GUIDES_TABLE)
  .where(snakelize({ courseId, guideId }))
  .then(processDbResponse)
  .then((response) => {
    if (!response) {
      throw new createError.NotFound(`Guide with guideId ${guideId} and courseId ${courseId} not found`);
    }
    if (!response.length) {
      return [response];
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
