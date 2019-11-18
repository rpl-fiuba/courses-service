const resolveDbHost = () => {
  const { DOCKER } = process.env;
  return DOCKER ? 'db' : 'localhost';
};

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
      host: resolveDbHost(),
      user: 'postgres',
      password: 'postgres',
      database: 'courses_service'
    }
  },
  dbDefault: {
    limit: 40,
    offset: 0,
  },
  services: {
    usersService: {
      url: {
        protocol: 'http',
        hostname: 'localhost',
        port: '7000'
      },
      paths: {
        auth: 'login'
      }
    },
  }
};
