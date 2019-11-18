const createError = require('http-errors');
const users = require('../databases/usersDb');

const ADMIN_ROLE = 'creator';
const STUDENT_ROLE = 'student';
const PROFESSOR_ROLE = 'professor';
const ROLES_WITH_EDIT_PERMISSIONS = [ADMIN_ROLE, PROFESSOR_ROLE];
const validRoles = [ADMIN_ROLE, STUDENT_ROLE, PROFESSOR_ROLE];

const getUsers = async ({
  courseId,
  limit,
  offset
}) => users.getUsers({
  courseId,
  limit,
  offset
});

const getUser = async ({
  userId,
  courseId,
}) => users.getUser({
  userId,
  courseId
});

const addUser = async ({
  courseId,
  userId,
  role
}) => {
  if (!validRoles.includes(role)) {
    return Promise.reject(
      createError.BadRequest(`Invalid role: ${role}. Valid roles: ${validRoles}`)
    );
  }
  return users.addUser({
    courseId,
    userId,
    role
  });
};

const updateUser = async ({
  courseId,
  userId,
  role
}) => users.updateUser({
  courseId,
  userId,
  role
});

const deleteUser = async ({
  courseId,
  userId
}) => users.deleteUser({
  userId,
  courseId
});

const isCreator = async ({
  userId, courseId
}) => getUser({
  userId,
  courseId,
})
  .then((user) => user.role === ADMIN_ROLE)
  .catch(() => false);

const hasEditPermission = async ({
  userId,
  courseId
}) => getUser({
  userId,
  courseId,
}).then((user) => ROLES_WITH_EDIT_PERMISSIONS.includes(user.role))
  .catch(() => false);


module.exports = {
  getUsers,
  getUser,
  addUser,
  updateUser,
  deleteUser,
  isCreator,
  hasEditPermission
};
