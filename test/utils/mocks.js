const nock = require('nock');
const url = require('url');
const configs = require('../../configs/test');

const usersServiceUrl = url.format(configs.services.usersService.url);

const mockUsersService = ({ status = 200, profile = {}, times = 1 }) => {
  nock(usersServiceUrl)
    .get('/login')
    .times(times)
    .reply(status, profile);
};

const mockUsersBulk = ({
  status = 200, users, userProfiles, times = 1
}) => {
  const userIds = users.map((user) => ({ id: user.userId }));

  nock(usersServiceUrl)
    .post('/users/profile', { userIds })
    .times(times)
    .reply(status, userProfiles);
};

module.exports = {
  mockUsersBulk,
  mockUsersService
};
