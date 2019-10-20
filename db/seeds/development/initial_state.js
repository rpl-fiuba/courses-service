
exports.seed = async (knex) => {
  await knex('courses').del();
  await knex('courses').insert([
    {
      course_id: 'coursename',
      name: 'course name',
      description: 'course description',
    },
  ]);
  await knex('course_users').del();
  await knex('course_users').insert([
    {
      course_id: 'coursename',
      user_id: 'Diego',
      role: 'admin'
    },
  ]);
  await knex('guides').del();
  await knex('guides').insert([
    {
      course_id: 'coursename',
      guide_id: 'guia_cursito',
      description: 'Curso 1',
    },
  ]);
};
