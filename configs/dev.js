// TODO: get it from  env

const dockerHosts = {
  db: 'courses-db',
  usersService: 'users-service'
};

const localhosts = {
  db: 'localhost',
  usersService: 'localhost'
};

const resolveHosts = () => {
  const { DOCKER } = process.env;
  return DOCKER ? dockerHosts : localhosts;
};

module.exports = {
  app: {
    protocol: 'http',
    hostname: '0.0.0.0',
    port: '5001'
  },
  db: {
    client: 'pg',
    version: '10.10',
    connection: {
      host: resolveHosts().db,
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
        hostname: resolveHosts().usersService,
        port: '7000'
      },
      paths: {
        auth: 'login',
        users: 'users/profile'
      }
    },
  }
};
