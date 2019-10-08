
exports.seed = async (knex) => {
  await knex('courses').del();
  await knex('courses').insert([
    {
      course_id: "coursito",
      name: "cursito",
      description: "Hola",
      creator: "Diego"
    },
  ]);
};
