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
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DATABASE
    }
  },
  dbDefault: {
    limit: 500,
    offset: 0,
  },
  services: {
    usersService: {
      url: {
        protocol: 'http',
        hostname: process.env.USERS_SERVICE_URL || 'learning.net.ar/users-service',
        port: 80
      },
      paths: {
        auth: 'login',
        users: 'users/profile'
      }
    },
  }
};
