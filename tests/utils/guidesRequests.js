const { doRequest, errorWrapper, baseUrl } = require('./requests');

const addGuide = async ({ token, guide }) => doRequest({
  requestUrl: `${baseUrl}/courses/${guide.courseId}/guides`,
  params: {
    method: 'POST',
    body: JSON.stringify(guide),
  },
  token,
});

const getGuides = async ({ courseId, token }) => doRequest({
  requestUrl: `${baseUrl}/courses/${courseId}/guides`,
  token,
});

const updateGuide = async ({
  guide, token,
}) => doRequest({
  requestUrl: `${baseUrl}/courses/${guide.courseId}/guides/${guide.guideId}`,
  params: {
    method: 'PUT',
    body: JSON.stringify({ name: guide.name, description: guide.description }),
  },
  token,
});


const deleteGuide = async ({ guide, token }) => doRequest({
  requestUrl: `${baseUrl}/courses/${guide.courseId}/guides/${guide.guideId}`,
  params: {
    method: 'DELETE',
  },
  token,
});

const getGuide = async ({ guide, token }) => doRequest({
  requestUrl: `${baseUrl}/courses/${guide.courseId}/guides/${guide.guideId}`,
  token,
});

module.exports = {
  addGuide: errorWrapper(addGuide),
  getGuides: errorWrapper(getGuides),
  updateGuide: errorWrapper(updateGuide),
  deleteGuide: errorWrapper(deleteGuide),
  getGuide: errorWrapper(getGuide),
};
