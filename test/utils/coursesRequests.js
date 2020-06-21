const fetch = require('node-fetch');
const { doRequest, errorWrapper, baseUrl } = require('./requests');

const status = () => {
  const statusUrl = `${baseUrl}/ping`;
  return fetch(statusUrl);
};

const searchCourses = async ({ token, search = '' }) => doRequest({
  requestUrl: `${baseUrl}/courses/search?search=${search}`,
  token,
});

const getUserCourses = async ({ token }) => doRequest({
  requestUrl: `${baseUrl}/courses`,
  token,
});

const deleteCourse = async ({ token, course }) => doRequest({
  requestUrl: `${baseUrl}/courses/${course.courseId}`,
  params: {
    method: 'DELETE'
  },
  token,
});

const publishCourse = async ({ token, course }) => doRequest({
  requestUrl: `${baseUrl}/courses/${course.courseId}/publish`,
  params: {
    method: 'PUT'
  },
  token
});

const getCourse = async ({ token, course }) => doRequest({
  requestUrl: `${baseUrl}/courses/${course.courseId}`,
  token,
});

const addCourse = async ({ token, course }) => {
  const data = {
    name: course.name,
    password: course.password,
    description: course.description
  };
  return doRequest({
    requestUrl: `${baseUrl}/courses`,
    params: {
      method: 'POST',
      body: JSON.stringify(data),
    },
    token,
  });
};

const updateCourse = async ({ course, token, }) => doRequest({
  requestUrl: `${baseUrl}/courses/${course.courseId}`,
  params: {
    method: 'PUT',
    body: JSON.stringify({ name: course.name, description: course.description }),
  },
  token
});

const getCourseUsers = async ({ courseId, token }) => doRequest({
  requestUrl: `${baseUrl}/courses/${courseId}/users`,
  token
});

const copyCourse = async ({ course, token, }) => doRequest({
  requestUrl: `${baseUrl}/courses/${course.courseId}/copy`,
  params: {
    method: 'POST',
    body: JSON.stringify({
      name: course.name,
      description: course.description,
      password: course.password
    }),
  },
  token
});

module.exports = {
  status: errorWrapper(status),
  addCourse: errorWrapper(addCourse),
  copyCourse: errorWrapper(copyCourse),
  getCourse: errorWrapper(getCourse),
  deleteCourse: errorWrapper(deleteCourse),
  updateCourse: errorWrapper(updateCourse),
  publishCourse: errorWrapper(publishCourse),
  searchCourses: errorWrapper(searchCourses),
  getUserCourses: errorWrapper(getUserCourses),
  getCourseUsers: errorWrapper(getCourseUsers),
};
