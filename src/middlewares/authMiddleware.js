const createError = require('http-errors');
const usersClient = require('../clients/usersClient');

/**
 * Check out for authentication information
 *
 */
module.exports = async (req, res, next) => {
  const { accessToken } = req.context;

  if (!accessToken) {
    next(createError.BadRequest('Authorization has not been provided'));
  }

  try {
    console.log("req.context is", req.context);
    const user = await usersClient.authenticate({ context: req.context });
    req.context.user = user;
    next();
  } catch (err) {
    console.log("Got error in authMiddleware.js", err)
    next(err);
  }
};
