const addActivityToCourses = async (knex, courses) => {
  const years = [2019, 2018];
  const months = [12, 11];
  const activities = [];

  for (const course of courses) { // eslint-disable-line no-restricted-syntax
    const courseUsers = await knex('course_users').select(); // eslint-disable-line no-await-in-loop

    for (const year of years) { // eslint-disable-line no-restricted-syntax
      for (const month of months) { // eslint-disable-line no-restricted-syntax
        const daysByMonth = new Date(year, month, 0).getDate();

        for (let day = 1; day < daysByMonth; day += 1) {
          const newDate = new Date(year, month - 1, day);

          for (const user of courseUsers) { // eslint-disable-line no-restricted-syntax
            const { user_id } = user; // eslint-disable-line camelcase

            if (Math.random() < 0.4) {
              activities.push({
                user_id, course_id: course.course_id, activity_date: newDate.toDateString()
              });
            }
          }
        }
      }
    }
  }

  await knex('users_activity').insert(activities);
};

module.exports = {
  addActivityToCourses
};
