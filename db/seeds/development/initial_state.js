
exports.seed = async (knex) => {
  await knex('courses').insert([
    {
      course_id: 'coursename',
      name: 'course name',
      description: 'course description',
    },
  ]);
  await knex('course_users').insert([
    {
      course_id: 'coursename',
      user_id: 'Diego',
      role: 'admin'
    },
  ]);
  await knex('guides').insert([
    {
      course_id: 'coursename',
      guide_id: 'guidename',
      name: 'guide name',
      description: 'Curso 1',
    },
  ]);
};
