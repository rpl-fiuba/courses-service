const createError = require('http-errors');
const expressify = require('expressify')();
const usersService = require('../services/usersService');
const logger = require('../utils/logger.js');

/**
 * Add Course.
 *
 */
const addCourse = async (req, res) => {
  const { googleProfile } = req.context;
  const userProfile = await usersService.login({
    context: req.context,
    userId: googleProfile.id
  });
  return res.status(200).json(userProfile);
};

/**
 * SignUp.
 *
 */
const signup = async (req, res) => {
  const availableRoles = ['professor', 'student'];
  const { context } = req;
  const { name, rol } = req.body;
  const { email, id } = context.googleProfile;
  const userMetadata = {
    userId: id,
    name,
    rol,
    email
  };

  if (!name || !rol || !availableRoles.includes(rol)) {
    return Promise.reject(createError.BadRequest('Authorization has not been provided'));
  }

  await usersService.signup({
    context,
    userMetadata
  });
  return res.status(201).json(userMetadata);
};

/**
 * Get user.
 *
 */
const getCourses = async (req, res) => {
  logger.onLog('Request:', `${req.method} ${req.url}`);

  const profile = await usersService.getUser({
    context: req.context,
    userId: req.params.userId
  });
  return res.status(200).json(profile);
};

module.exports = expressify({
  login,
  signup,
  getUser
});
