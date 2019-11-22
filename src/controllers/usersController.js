const expressify = require('expressify')();
const createError = require('http-errors');
const usersService = require('../services/usersService');

const getUsersFromCourse = async (req, res) => {
  const { courseId } = req.params;
  // TODO: return just user ids? or get the info from users service
  const users = await usersService.getUsersFromCourse({ courseId });

  return res.status(200).json(users);
};

const getUser = async (req, res) => {
  const { courseId, userId } = req.params;
  const user = await usersService.getUser({ courseId, userId });
  return res.status(200).json(user);
};

const addUserToCourse = async (req, res) => {
  const { courseId } = req.params;
  const { userId } = req.context.user;
  const { role, password } = req.body;

  await usersService.addUserToCourse({
    courseId, userId, role, password
  });

  return res.status(201).json({ courseId, userId, role });
};

const updateUser = async (req, res) => {
  const { courseId, userId } = req.params;
  const { role } = req.body;

  if (!role) {
    return Promise.reject(createError.BadRequest('user role has not been provided'));
  }

  await usersService.updateUser({ courseId, userId, role });
  return res.status(200).json({ courseId, userId, role });
};

const deleteUserFromCourse = async (req, res) => {
  const { courseId, userId } = req.params;
  await usersService.deleteUserFromCourse({ courseId, userId });
  return res.status(204).json({});
};

module.exports = expressify({
  getUsersFromCourse,
  addUserToCourse,
  deleteUserFromCourse,
  getUser,
  updateUser,
});
