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
  lastDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = Math.floor(today.getTime() - lastDate.getTime());

  // just saving one activity per day
  if (Math.floor(diffTime) > 0) {
    await usersDb.registerUserActivity({ courseId, userId });
  }
  next();
};
