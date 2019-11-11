
exports.seed = async (knex) => {
  const currentCourses = await knex('courses').select();
  const currentGuides = await knex('guides').select();
  const currentUsers = await knex('course_users').select();

  if (!currentCourses.length) {
    await knex('courses').insert([
      {
        course_id: 'coursename',
        name: 'course name',
        description: 'course description',
        course_status: 'draft'
      },
    ]);
  }
  if (!currentUsers.length) {
    await knex('course_users').insert([
      {
        course_id: 'coursename',
        user_id: 'Diego',
        role: 'admin'
      },
    ]);
  }
  if (!currentGuides.length) {
    await knex('guides').insert([
      {
        course_id: 'coursename',
        guide_id: 'guidename',
        name: 'guide name',
        description: 'Curso 1',
        guide_status: 'draft'
      },
    ]);
  }
};
