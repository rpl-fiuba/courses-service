exports.up = (knex) => {
  const query = `
    CREATE EXTENSION IF NOT EXISTS unaccent;
  `;

  return knex.raw(query);
};

exports.down = (knex) => {
  const query = `
    DROP EXTENSION IF EXISTS unaccent;
  `;
  return knex.raw(query);
};
