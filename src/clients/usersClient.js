const bluebird = require('bluebird');
const createError = require('http-errors');
const { google } = require('googleapis');

const { OAuth2 } = google.auth;
const userinfo = bluebird.promisifyAll(google.oauth2('v2').userinfo);

const authenticate = async ({ context }) => {
  const { token } = context;
  const oauth2Client = new OAuth2();
  oauth2Client.setCredentials({ access_token: token });

  try {
    const response = await userinfo.getAsync({ auth: oauth2Client });
    return response.data;
  } catch (err) {
    const message = (err.errors && err.errors[0] && err.errors[0].message)
      || err.response.statusText;
    return Promise.reject(createError(parseInt(err.code, 10), message));
  }
};

module.exports = {
  authenticate
};
