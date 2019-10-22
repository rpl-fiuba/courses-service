const createError = require('http-errors');


/**
 * Check out for authentication information
 *
 */
module.exports = (req, res, next) => {
  const { token } = req.context;

  if (!token) {
    next(createError.BadRequest('Authorization has not been provided'));
  }

  // TODO: users service integration

  next();
};
