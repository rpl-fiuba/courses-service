const { assert, expect } = require('chai');
const requests = require('./utils/coursesRequests');
const { cleanDb } = require('./utils/db');
const mocks = require('./utils/mocks');
const { addCourseMocks } = require('./utils/dbMockFactory');

process.env.NODE_ENV = 'test';

require('./setup.js');

describe('Course Tests', () => {
  let response;
  const token = 'diego';
  let course;
  let courses;

  beforeEach(() => {
    cleanDb();
    mocks.mockUsersService({});
    course = { name: 'curso', description: 'description', courseId: 'curso' };
    courses = [];
  });
  afterEach(cleanDb);

  describe('Add course', () => {
    describe('When is successfully added', () => {
      beforeEach(async () => {
        response = await requests.addCourse({ token, course });
      });

      it('status is OK', () => assert.equal(response.status, 201));

      it('get course should return the course added', async () => {
        response = await requests.getCourses({ token });
        courses = response.body;
        expect(courses).to.deep.include(course);
        expect(courses).to.deep.include(course);
      });
    });

    describe('When already exists', () => {
      beforeEach(async () => {
        response = await requests.addCourse({ course, token });
        response = await requests.addCourse({ course, token });
      });

      it('should return code 409', () => assert.equal(response.status, 409));
    });

    describe('When there are missing fields', () => {
      it('should return BAD REQUEST', async () => {
        // Missing name
        const courseWithoutName = { ...course };
        delete courseWithoutName.name;
        response = await requests.addCourse({ course: courseWithoutName, token });
        assert.equal(response.status, 400);
        delete course.description;
        // Missing description
        const courseWithoutDesc = { ...course };
        delete courseWithoutDesc.description;
        response = await requests.addCourse({ course: courseWithoutDesc, token });
        assert.equal(response.status, 400);
      });
    });
  });

  describe('Delete course', () => {
    describe('When there are courses', () => {
      let courseToDelete;

      beforeEach(async () => {
        const coursesAndCreators = await addCourseMocks({ coursesNumber: 3, creatorId: 'diego' });
        courses = coursesAndCreators.courses;
        courseToDelete = courses[0]; // eslint-disable-line
        response = await requests.deleteCourse({ token, course: courseToDelete });
      });

      it('status is OK', () => assert.equal(response.status, 200));

      it('get deleted course returns 404', async () => {
        response = await requests.getCourse({ course, token });
        assert.deepEqual(response.status, 404);
      });
    });
  });

  describe('Get course', () => {
    describe('When the course exists', () => {
      let expectedCourse;

      beforeEach(async () => {
        const coursesAndCreators = await addCourseMocks({ coursesNumber: 1, creatorId: token });
        expectedCourse = coursesAndCreators.courses[0]; // eslint-disable-line
        response = await requests.getCourse({ token, course: expectedCourse });
      });

      it('status is OK', () => assert.equal(response.status, 200));

      it('body is the course', () => assert.deepEqual(response.body, expectedCourse));
    });

    describe('When the course does not exist', () => {
      beforeEach(async () => {
        response = await requests.getCourse({ token, course });
      });
      it('should return NOT FOUND', () => assert.equal(response.status, 404));
    });
  });


  describe('Get courses', () => {
    describe('When there are courses', () => {
      let expectedCourses;
      beforeEach(async () => {
        const coursesAndCreators = await addCourseMocks({ coursesNumber: 3, creatorId: token });
        expectedCourses = coursesAndCreators.courses;
        response = await requests.getCourses({ token });
      });

      it('status is OK', () => assert.equal(response.status, 200));
      it('body has the course', () => assert.deepEqual(response.body, expectedCourses));
    });

    describe('When there are zero courses', () => {
      it('should return NOT FOUND', async () => {
        response = await requests.getCourses({ token });
        assert.equal(response.status, 404);
      });
    });
  });


  describe('Update course', () => {
    let finalCourse;

    describe('When the course exists', () => {
      beforeEach(async () => {
        const coursesAndCreators = await addCourseMocks({ coursesNumber: 1, creatorId: token });
        const [firstCourse] = coursesAndCreators.courses;

        const name = 'curso';
        const description = 'un curso mas';
        finalCourse = { courseId: firstCourse.courseId, name, description };

        response = await requests.updateCourse({ course: finalCourse, token });
      });

      it('should return status OK', () => assert.equal(response.status, 200));

      it('get course should return the course updated', async () => {
        response = await requests.getCourse({ course: finalCourse, token });
        assert.deepEqual(response.body, finalCourse);
      });
    });

    describe('When the user does not have permission', () => {
      beforeEach(async () => {
        const coursesAndCreators = await addCourseMocks({
          coursesNumber: 1, creatorId: 'anotherCreator'
        });
        const [firstCourse] = coursesAndCreators.courses;

        response = await requests.updateCourse({ course: firstCourse, token });
      });

      it('should return Forbidden', () => assert.equal(response.status, 403));
    });

    describe('When the course does not exist', () => {
      beforeEach(async () => {
        response = await requests.updateCourse({
          course: { courseId: 'inexistent', name: 'new name', description: 'new description' },
          token,
        });
      });

      it('should return NOT FOUND', () => assert.equal(response.status, 404));
    });
  });
});
