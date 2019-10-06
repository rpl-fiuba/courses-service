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
      host: '127.0.0.1',
      user: 'postgres',
      password: 'postgres',
      database: 'courses_service'
    }
  }
};
