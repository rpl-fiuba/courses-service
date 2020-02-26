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

/**
 * Get user activity
 *
 */
const getUsersActivity = async ({ context, courseId }) => {
  const usersActivityCount = await usersDb.getUsersActivity({ context, courseId });
  const byYear = groupByActivity(usersActivityCount, 'year');

  return byYear.list.map((year) => {
    const byMonth = groupByActivity(byYear.objs[year], 'month');

    const activityMonths = byMonth.list.map((month) => {
      const daysWithActivity = byMonth.objs[month];
      const daysByMonth = new Date(year, month, 0).getDate();

      // if some day there was not activity, then the count of users is 0
      const activityDays = [];
      for (let day = 1; day < daysByMonth; day += 1) {
        const dayWithActivity = daysWithActivity.find((obj) => obj.day === day);
        if (!dayWithActivity) {
          activityDays.push({ day, count: 0 });
        } else {
          activityDays.push({ day, count: parseInt(dayWithActivity.count, 10) });
        }
      }

      return { month, days: activityDays };
    });

    return { year, months: activityMonths };
  });
};

const groupByActivity = (activityObjs, groupTag) => {
  const groupList = [];
  const groupObjects = {};

  activityObjs.forEach((activity) => {
    const group = activity[groupTag];

    if (!groupList.includes(group)) {
      groupList.push(group);
    }
    if (!groupObjects[group]) {
      groupObjects[group] = [];
    }
    groupObjects[group].push(activity);
  });

  return {
    list: groupList,
    objs: groupObjects
  };
};


const getUser = async ({ userId, courseId }) => usersDb.getUser({ userId, courseId });

const addUserToCourse = async ({
  courseId,
  userId,
  role,
  password
}) => {
  if (!validRoles.includes(role)) {
    return Promise.reject(createError.BadRequest(`Invalid role: ${role}. Valid roles: ${validRoles}`));
  }

  const course = await coursesDb.getCourse({ courseId });

  if (course.password && course.password !== password) {
    return Promise.reject(createError.Conflict('The password is invalid'));
  }

  return usersDb.addUser({
    courseId, userId, role
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
  getUsersActivity,
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
