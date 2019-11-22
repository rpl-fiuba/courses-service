const configs = require('../../configs/test');
const { snakelize, camilize } = require('../../src/utils/dbUtils');
const knex = require('knex')(configs.db); // eslint-disable-line

const arrayWithKeys = (keysAmount) => [...Array(keysAmount).keys()];

const courseMock = ({ index, courseStatus, password }) => snakelize({
  courseId: `coursename${index}`,
  name: `course name ${index}`,
  description: `course description ${index}`,
  courseStatus,
  password
});

const courseUserMock = ({ courseId, index, role }) => snakelize({
  userId: `user${index}`,
  courseId,
  role,
});

const addCourseUserMocks = async ({ courseId, usersAmount, role }) => {
  const courseUsers = arrayWithKeys(usersAmount)
    .map((index) => ({ courseId, index, role }))
    .map(courseUserMock);
  await knex('course_users').insert(courseUsers);

  return courseUsers.map(camilize);
};

const creatorMockFromCourse = ({ courseId, userId }) => snakelize({
  courseId,
  userId,
  role: 'creator',
});

const guideMock = ({ courseId, index }) => snakelize({
  courseId,
  guide_id: `guidename${index}`,
  name: `guide name ${index}`,
  description: `guide description ${index}`,
});

const addGuideMocks = async ({ courseId, guidesAmount }) => {
  const guides = arrayWithKeys(guidesAmount)
    .map((index) => ({ courseId, index }))
    .map(guideMock);
  await knex('guides').insert(guides);
  return guides.map(camilize);
};

const addCourseMocks = async ({
  coursesNumber, courseStatus, password, creator
}) => {
  // first create courses
  const courses = arrayWithKeys(coursesNumber).map(
    (index) => courseMock({ index, courseStatus, password })
  );
  await knex('courses').insert(courses);

  // then the creator is created
  const creators = courses
    .map(camilize)
    .map((course) => ({ courseId: course.courseId, userId: creator.userId }))
    .map(creatorMockFromCourse);
  await knex('course_users').insert(creators);

  return {
    courses: courses.map(camilize),
    creators: creators.map(camilize),
  };
};

module.exports = {
  addCourseMocks,
  addGuideMocks,
  addCourseUserMocks,
};
