const createError = require('http-errors');
const guides = require('../databases/guidesDb');
const coursesService = require('./coursesService');
const usersService = require('./usersService');

const getGuides = async ({
  courseId,
  limit,
  offset,
}) => guides.getGuides({ courseId, limit, offset });

const addGuide = async ({
  courseId,
  name,
  description,
  userId,
}) => {
  if (!await coursesService.courseExists({ courseId })) {
    return Promise.reject(createError.BadRequest(`course with id: ${courseId} does not exist`));
  }

  if (!await usersService.isAdmin({ courseId, userId })
    && !await usersService.isProfessor({ courseId, userId })) {
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

  await guides.addGuide({ guide });
  return guide;
};

const deleteGuide = async ({
  courseId,
  guideId,
}) => guides.deleteGuide({ courseId, guideId });

const guideExists = async ({ courseId, guideId }) => guides.getGuide({ courseId, guideId })
  .then(() => true)
  .catch(() => false);

const updateGuide = async ({
  courseId,
  guideId,
  name,
  description,
  userId,
}) => {
  if (!await coursesService.courseExists({ courseId })) {
    return Promise.reject(createError.NotFound(`Course with id: ${courseId} not found`));
  }
  if (!await guideExists({ courseId, guideId })) {
    return Promise.reject(createError.NotFound(
      `Guide with id ${guideId} not found for course with id ${courseId}`
    ));
  }

  if (!await usersService.isAdmin({ courseId, userId })
    && !await usersService.isProfessor({ courseId, userId })) {
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

  await guides.updateGuide(guide);
  return guide;
};


const getGuide = async ({ courseId, guideId }) => guides.getGuide({ courseId, guideId });

module.exports = {
  getGuides,
  getGuide,
  addGuide,
  deleteGuide,
  updateGuide,
};
