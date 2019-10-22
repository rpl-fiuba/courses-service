const url = require('url');
const fetch = require('node-fetch');
const configs = require('../../configs');

const baseUrl = url.format(configs.app);

const doRequest = async ({ requestUrl, params, token }) => {
  const requestParams = !params ? {} : params;
  requestParams.headers = {
    authorization: token,
    'Content-Type': 'application/json',
  };
  const response = await fetch(requestUrl, requestParams);
  return { status: response.status, body: await response.json() };
};

const status = () => {
  const statusUrl = `${baseUrl}/ping`;
  return fetch(statusUrl);
};

const getCourses = async ({ token }) => doRequest({
  requestUrl: `${baseUrl}/courses`,
  token,
});

const deleteCourse = async ({ token, id }) => doRequest({
  requestUrl: `${baseUrl}/courses/${id}`,
  params: {
    method: 'DELETE'
  },
  token,
});

const getCourse = async ({ token, id }) => doRequest({
  requestUrl: `${baseUrl}/courses/${id}`,
  token,
});

const addCourse = async ({ token, name, description }) => {
  const data = { name, description };
  return doRequest({
    requestUrl: `${baseUrl}/courses`,
    params: {
      method: 'POST',
      body: JSON.stringify(data),
    },
    token,
  });
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


module.exports = {
  status: errorWrapper(status),
  getCourses: errorWrapper(getCourses),
  addCourse: errorWrapper(addCourse),
  getCourse: errorWrapper(getCourse),
  deleteCourse: errorWrapper(deleteCourse),
};
