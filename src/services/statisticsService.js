const usersDb = require('../databases/usersDb');


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
      const daysWithActivity = byMonth.objs[month] || [];
      const daysByMonth = new Date(year, month - 1, 0).getDate();

      // if some day there was not activity, then the count of users is 0
      const activityDays = [];
      for (let day = 1; day <= daysByMonth; day += 1) {
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


module.exports = {
  getUsersActivity
};
