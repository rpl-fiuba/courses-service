const configs = require('../../configs/test');
const { snakelize, camilize } = require('../../src/utils/dbUtils');
const knex = require('knex')(configs.db); // eslint-disable-line

const arrayWithKeys = (keysAmount) => [...Array(keysAmount).keys()];

const courseMock = (index) => snakelize({
  courseId: `coursename${index}`,
  name: `course name ${index}`,
  description: `course description ${index}`
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
  role: 'admin',
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

const addCourseMocks = async ({ coursesNumber, creatorId }) => {
  const courses = arrayWithKeys(coursesNumber)
    .map(courseMock);
  await knex('courses').insert(courses);

  const creators = courses
    .map(camilize)
    .map((course) => ({ courseId: course.courseId, userId: creatorId }))
    .map(creatorMockFromCourse);
  const creatorsResult = await knex('course_users').insert(creators); // eslint-disable-line

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
