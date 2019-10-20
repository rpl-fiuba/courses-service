const courses = require('../databases/coursesDb');

const getCourse = async ({ id }) => courses.getCourse({ id });

const getCourses = async ({ page, limit, userToken }) => {
  // TODO: users service integration for the moment we use the token
  const userId = userToken;
  const coursesByUser = await courses.getCoursesByUser({ page, limit, userId });
  const result = coursesByUser.map((c) => getCourse({ id: c.courseId }));
  return Promise.all(result);
};

const addCourse = async ({ description, name, creatorId }) => {
  // TODO: hacer esto mejor
  const id = name.toLowerCase().replace(' ', '');
  await courses.addCourse({
    name,
    description,
    creatorId,
    courseId: id,
  });
};

module.exports = {
  getCourses,
  addCourse,
};
