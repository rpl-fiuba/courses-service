const _ = require('lodash');
const createError = require('http-errors');
const usersDb = require('../databases/usersDb');
const coursesDb = require('../databases/coursesDb');
const usersClient = require('../clients/usersClient');

const ADMIN_ROLE = 'creator';
const STUDENT_ROLE = 'student';
const PROFESSOR_ROLE = 'professor';
const ROLES_WITH_EDIT_PERMISSIONS = [ADMIN_ROLE, PROFESSOR_ROLE];
const validRoles = [ADMIN_ROLE, STUDENT_ROLE, PROFESSOR_ROLE];

/**
 * Get users from a course
 *
 */
const getUsersFromCourse = async ({
  context,
  courseId,
  limit,
  offset
}) => {
  const dbUsers = await usersDb.getUsers({ courseId, limit, offset });
  const userIds = dbUsers.map((user) => ({ id: user.userId }));
  const usersWithInfo = await getUsersFromIds({ context, userIds });

  return usersWithInfo.map((user) => ({
    name: user.name,
    email: user.email,
    userId: user.userId,
    role: (dbUsers.find((u) => user.userId === u.userId)).role
  }));
};

/**
 * Get users giving a list of object that contains the id of the users
 *
 */
const getUsersFromIds = async ({ context, userIds }) => {
  const uniqueUserIds = _.uniqWith(userIds, _.isEqual);

  return usersClient.getUsersAsBulk({ context, userIds: uniqueUserIds });
};

const getUser = async ({
  userId,
  courseId,
}) => usersDb.getUser({
  userId,
  courseId
});

const addUserToCourse = async ({
  courseId,
  userId,
  role,
  password
}) => {
  if (!validRoles.includes(role)) {
    return Promise.reject(
      createError.BadRequest(`Invalid role: ${role}. Valid roles: ${validRoles}`)
    );
  }

  const course = await coursesDb.getCourse({ courseId });

  if (course.password && course.password !== password) {
    return Promise.reject(
      createError.Conflict('The password is invalid')
    );
  }

  return usersDb.addUser({
    courseId,
    userId,
    role
  });
};

const updateUser = async ({
  courseId,
  userId,
  role
}) => usersDb.updateUser({
  courseId,
  userId,
  role
});

const deleteUserFromCourse = async ({
  courseId,
  userId
}) => usersDb.deleteUser({
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

const isProfessor = async ({
  userId, courseId
}) => getUser({
  userId,
  courseId,
})
  .then((user) => ROLES_WITH_EDIT_PERMISSIONS.includes(user.role))
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
  getUsersFromCourse,
  getUsersFromIds,
  addUserToCourse,
  deleteUserFromCourse,
  getUser,
  updateUser,
  isCreator,
  isProfessor,
  hasEditPermission
};
