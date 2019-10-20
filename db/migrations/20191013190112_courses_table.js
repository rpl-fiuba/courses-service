exports.up = (knex) => {
  const query = `
    create type user_role as enum('student', 'professor', 'admin');

    CREATE TABLE IF NOT EXISTS courses(
      id            CHARACTER VARYING(256) NOT NULL,
      name          CHARACTER VARYING(128) NOT NULL,
      description   CHARACTER VARYING(256) NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS course_users(
      course_id   CHARACTER VARYING(128) NOT NULL,
      user_id     CHARACTER VARYING(128) NOT NULL,
      role        user_role NOT NULL
    );

    CREATE TABLE IF NOT EXISTS guides(
      guide_id      CHARACTER VARYING(256) NOT NULL,
      course_id     CHARACTER VARYING(256) NOT NULL,
      description   CHARACTER VARYING(256) NOT NULL
    );
    `;

  return knex.raw(query);
};

exports.down = (knex) => {
  const query = `
    DROP TABLE courses;
    DROP TABLE guides;
    DROP TABLE course_users;
  `;
  return knex.raw(query);
};
