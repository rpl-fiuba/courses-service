const url = require('url');
const fetch = require('node-fetch');
const requestUtils = require('../utils/requestUtils');
const configs = require('../configs')();

const usersServiceUrl = url.format(configs.services.usersService.url);

const authenticate = async ({ context }) => {
  const authPath = configs.services.usersService.paths.auth;
  const authUrl = `${usersServiceUrl}/${authPath}`;

  const response = await fetch(authUrl, {
    headers: {
      Authorization: context.accessToken
    }
  });

  return requestUtils.processResponse(response);
};

const getUsersAsBulk = async ({ context, userIds }) => {
  const usersPath = configs.services.usersService.paths.users;
  const usersUrl = `${usersServiceUrl}/${usersPath}`;

  const response = await fetch(usersUrl, {
    headers: {
      Authorization: context.accessToken,
      'Content-Type': 'application/json'
    },
    method: 'post',
    body: JSON.stringify({ userIds })
  });

  return requestUtils.processResponse(response);
};


module.exports = {
  authenticate,
  getUsersAsBulk
};
