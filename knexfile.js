const configs = require('./configs');

module.exports = {
  development: {
    ...configs.db,
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/development'
    },
    useNullAsDefault: true
  },
  test: {
    ...configs.db,
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true
  }
};
