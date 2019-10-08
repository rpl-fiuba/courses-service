exports.up = (knex) => {
  const query = `
    CREATE TABLE IF NOT EXISTS courses(
      course_id CHARACTER VARYING(128) NOT NULL,
      name    CHARACTER VARYING(128) NOT NULL,
      description   CHARACTER VARYING(256) NOT NULL,
      creator  CHARACTER VARYING(128) NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS course_users(
      course_id CHARACTER VARYING(128) NOT NULL,
      user_id CHARACTER VARYING(128) NOT NULL,
      role CHARACTER VARYING(128) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS course_guides(
      course_id CHARACTER VARYING(128) NOT NULL,
      guide_id CHARACTER VARYING(128) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS guides(
      guide_id CHARACTER VARYING(128) NOT NULL,
      description CHARACTER VARYING(128) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS guide_exercise(
      guide_id CHARACTER VARYING(128) NOT NULL,
      exercise_id CHARACTER VARYING(128) NOT NULL
    );
    `;

  return knex.raw(query);
};

exports.down = (knex) => {
  const query = `
    DROP TABLE courses;
    DROP TABLE guides;
    DROP TABLE course_users;
    DROP TABLE guide_exercise;`;
  return knex.raw(query);
};
