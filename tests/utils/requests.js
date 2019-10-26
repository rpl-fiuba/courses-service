const fetch = require('node-fetch');
const url = require('url');
const configs = require('../../src/configs')();

const doRequest = async ({ requestUrl, params, token }) => {
  const requestParams = !params ? {} : params;
  requestParams.headers = {
    authorization: token,
    'Content-Type': 'application/json',
  };
  const response = await fetch(requestUrl, requestParams);
  return { status: response.status, body: await response.json() };
};

function errorWrapper(funct) {
  return function inner(...args) {
    try {
      return funct(...args);
    } catch (err) {
      return err;
    }
  };
}

const baseUrl = url.format(configs.app);

module.exports = {
  doRequest,
  errorWrapper,
  baseUrl,
};
