const createError = require('http-errors');

const googleClient = require('../clients/googleClient');

/**
 * Executes authentication and saves the profile in the context.
 *
 */
module.exports = async (req, res, next) => {
  const { context } = req;

  if (!context.token) {
    next(createError.BadRequest('Authorization has not been provided'));
  }

  try {
    const profile = await googleClient.authenticate({ context });
    req.context.googleProfile = profile;
    next();
  } catch (err) {
    next(err);
  }
};
