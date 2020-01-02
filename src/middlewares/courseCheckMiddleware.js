const _ = require('lodash');
const coursesDb = require('../databases/coursesDb');

/**
 * Check if the course exists or not
 *
 */
module.exports = async (req, res, next) => {
  const { courseId } = req.params;

  try {
    const course = await coursesDb.getCourse({ courseId });
    _.set(course, 'req.context');
    next();
  } catch (e) {
    next(e);
  }
};
