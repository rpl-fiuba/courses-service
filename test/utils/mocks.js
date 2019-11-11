const nock = require('nock');

const mockGoogleAuth = ({ status = 200, response = {} }) => {
  nock('https://www.googleapis.com/oauth2/v2')
    .get('/userinfo')
    .reply(status, response);
};

//
const mockUsersService = () => {
  nock('http://localhost:7000')
    .persist()
    .get('/auth')
      .reply(function(uri, requestBody) { // eslint-disable-line
      const [authorization] = this.req.headers.authorization;
      return { userId: authorization };
    });
};

module.exports = {
  mockGoogleAuth,
  mockUsersService,
};
