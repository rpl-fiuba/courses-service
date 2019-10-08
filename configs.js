module.exports = {
  app: {
    protocol: 'http',
    hostname: 'localhost',
    port: '5001'
  },
  db: {
    client: 'pg',
    version: '10.10',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: 'postgres',
      database: 'courses'
    }
  },
  coursesConfig: {
    pageSize: 40
  }
};
