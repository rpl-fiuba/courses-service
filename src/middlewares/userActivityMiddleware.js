const usersDb = require('../databases/usersDb');

/**
 * Register user activity
 *
 */
module.exports = async (req, res, next) => {
  const { courseId } = req.params;
  const { userId } = req.context.user;

  const userActivity = await usersDb.getUsersActivity({ courseId, userId });
  const lastUserActivity = userActivity[0];

  if (!lastUserActivity) {
    await usersDb.registerUserActivity({ courseId, userId });
    next();

    return;
  }

  const { day, month, year } = lastUserActivity;
  const lastDate = new Date(year, month - 1, day);
  const newDate = new Date();
  const today = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getUTCDate());

  const diffTime = today.getTime() - lastDate.getTime();

  // just saving one activity per day
  if (diffTime > 0) {
    await usersDb.registerUserActivity({ courseId, userId });
  }
  next();
};
