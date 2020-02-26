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
  const lastDate = new Date(year, month, day);
  const today = new Date();

  const diffInTime = today.getTime() - lastDate.getTime();
  const diffInDays = diffInTime / (1000 * 3600 * 24);

  if (diffInDays > 0) {
    await usersDb.registerUserActivity({ courseId, userId });
  }
  next();
};
