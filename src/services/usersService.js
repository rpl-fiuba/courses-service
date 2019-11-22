const createError = require('http-errors');
const users = require('../databases/usersDb');
const coursesDb = require('../databases/coursesDb');

const ADMIN_ROLE = 'creator';
const STUDENT_ROLE = 'student';
const PROFESSOR_ROLE = 'professor';
const ROLES_WITH_EDIT_PERMISSIONS = [ADMIN_ROLE, PROFESSOR_ROLE];
const validRoles = [ADMIN_ROLE, STUDENT_ROLE, PROFESSOR_ROLE];

const getUsersFromCourse = async ({
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

const deleteUserFromCourse = async ({
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
  getUsersFromCourse,
  addUserToCourse,
  deleteUserFromCourse,
  getUser,
  updateUser,
  isCreator,
  hasEditPermission
};
