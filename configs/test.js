const configs = require('./dev');

module.exports = {
  ...configs,
  db: {
    ...configs.db,
    connection: {
      ...configs.db.connection,
      database: 'courses_service_test'
    }
  }
};
