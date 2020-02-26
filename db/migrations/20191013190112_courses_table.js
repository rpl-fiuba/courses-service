exports.up = (knex) => {
  const query = `
    create type user_role as enum('student', 'professor', 'creator');
    create type status as enum('draft', 'published');

    CREATE TABLE IF NOT EXISTS courses(
      course_id       CHARACTER VARYING(256) NOT NULL PRIMARY KEY,
      name            CHARACTER VARYING(128) NOT NULL,
      course_status   status NOT NULL DEFAULT 'draft',
      description     CHARACTER VARYING(256),
      password        CHARACTER VARYING(64),
      created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS course_users(
      course_id   CHARACTER VARYING(128) NOT NULL,
      user_id     CHARACTER VARYING(128) NOT NULL,
      role        user_role NOT NULL,
      PRIMARY KEY (user_id, course_id)
    );

    CREATE TABLE IF NOT EXISTS guides(
      guide_id      CHARACTER VARYING(256) NOT NULL,
      course_id     CHARACTER VARYING(256) NOT NULL,
      name          CHARACTER VARYING(256) NOT NULL,
      description   CHARACTER VARYING(256),
      created_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      guide_status  status NOT NULL DEFAULT 'draft',
      PRIMARY KEY (guide_id, course_id)
    );

    CREATE TABLE IF NOT EXISTS users_activity(
      course_id     CHARACTER VARYING(256) NOT NULL,
      user_id       CHARACTER VARYING(256) NOT NULL,
      activity_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `;

  return knex.raw(query);
};

exports.down = (knex) => {
  const query = `
    DROP TABLE courses;
    DROP TABLE guides;
    DROP TABLE course_users;
    DROP TABLE users_activity;
    DROP TYPE user_role;
    DROP TYPE status;
  `;
  return knex.raw(query);
};
