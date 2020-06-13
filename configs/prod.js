// TODO: get it from  env

module.exports = {
  app: {
    protocol: 'http',
    hostname: '0.0.0.0',
    port: process.env.PORT || '5001'
  },
  db: {
    client: 'pg',
    version: '10.10',
    connection: process.env.DATABASE_URL
  },
  dbDefault: {
    limit: 40,
    offset: 0,
  },
  services: {
    usersService: {
      url: process.env.USERS_SERVICE_URL || 'https://math-learning-users-service.herokuapp.com',
      paths: {
        auth: 'login',
        users: 'users/profile'
      }
    },
  }
};
