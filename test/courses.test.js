const _ = require('lodash');
const { assert, expect } = require('chai');
const requests = require('./utils/coursesRequests');
const { cleanDb, sanitizeResponse } = require('./utils/db');
const mocks = require('./utils/mocks');
const { addCourseMocks, addCourseUserMocks } = require('./utils/dbMockFactory');

process.env.NODE_ENV = 'test';

require('./setup.js');

describe('Course Tests', () => {
  const token = 'diego';
  let response;
  let studentProfile;
  let professorProfile;
  let course;
  let courses;

  before(cleanDb);
  beforeEach(() => {
    course = {
      name: 'curso',
      description: 'description',
      courseId: 'curso'
    };
    courses = [];
    professorProfile = {
      userId: 'professor-id',
      name: 'Licha',
      email: 'licha@gmail',
      role: 'professor'
    };
    studentProfile = {
      userId: 'student-id',
      name: 'Pepito',
      email: 'student@gmail',
      role: 'student'
    };
  });
  afterEach(cleanDb);

  describe('Add course', () => {
    describe('When is successfully added', () => {
      let createdCourse;
      let expectedCourse;

      beforeEach(async () => {
        mocks.mockUsersService({ profile: professorProfile });
        createdCourse = {
          ...course,
          password: 'secret',
          courseStatus: 'draft'
        };
        expectedCourse = {
          ...createdCourse,
          guides: [],
          users: [{ ...professorProfile, role: 'creator' }],
          professors: [{ ...professorProfile, role: 'creator' }]
        };
        response = await requests.addCourse({ token, course: createdCourse });
      });

      it('status is OK', () => assert.equal(response.status, 201));

      it('body has the created course is OK', () => {
        expect(sanitizeResponse(response.body)).to.deep.equal(expectedCourse);
      });

      it('get course should return the course added', async () => {
        mocks.mockUsersService({ profile: professorProfile });
        mocks.mockUsersBulk({ users: [professorProfile], userProfiles: [professorProfile] });

        const expectedCourses = [{
          ...createdCourse,
          professors: [professorProfile]
        }];
        response = await requests.getUserCourses({ token });
        courses = response.body;

        expect(sanitizeResponse(courses)).to.deep.equal(expectedCourses);
      });
    });

    describe('When already exists', () => {
      beforeEach(async () => {
        mocks.mockUsersService({ profile: professorProfile, times: 2 });

        response = await requests.addCourse({ course, token });
        response = await requests.addCourse({ course, token });
      });

      it('should return code 409', () => assert.equal(response.status, 409));
    });

    describe('When there are missing fields', () => {
      describe('when missing name', () => {
        beforeEach(async () => {
          mocks.mockUsersService({ profile: professorProfile });

          const courseWithoutName = { ...course };
          delete courseWithoutName.name;
          response = await requests.addCourse({ course: courseWithoutName, token });
        });

        it('should return BAD REQUEST', async () => {
          assert.equal(response.status, 400);
          delete course.description;
        });
      });

      describe('when missing description', () => {
        beforeEach(async () => {
          mocks.mockUsersService({ profile: professorProfile });

          const courseWithoutDesc = { ...course };
          delete courseWithoutDesc.description;
          response = await requests.addCourse({ course: courseWithoutDesc, token });
        });

        it('should return BAD REQUEST', async () => {
          assert.equal(response.status, 400);
        });
      });
    });
  });

  describe('Delete course', () => {
    describe('When there are courses', () => {
      let courseToDelete;

      beforeEach(async () => {
        mocks.mockUsersService({ profile: professorProfile });

        const coursesAndCreators = await addCourseMocks({
          coursesNumber: 3,
          creator: professorProfile
        });
        courses = coursesAndCreators.courses;
        courseToDelete = courses[0]; // eslint-disable-line
        response = await requests.deleteCourse({ token, course: courseToDelete });
      });

      it('status is OK', () => assert.equal(response.status, 204));

      it('get deleted course returns 404', async () => {
        mocks.mockUsersService({ profile: professorProfile });
        response = await requests.getCourse({ course, token });
        assert.deepEqual(response.status, 404);
      });
    });
  });

  describe('Get course', () => {
    describe('When the course exists', () => {
      let expectedCourse;

      beforeEach(async () => {
        mocks.mockUsersService({ profile: professorProfile });
        mocks.mockUsersBulk({ users: [professorProfile], userProfiles: [professorProfile] });

        const coursesAndCreators = await addCourseMocks({
          coursesNumber: 1,
          creator: professorProfile
        });
        expectedCourse = {
          ...coursesAndCreators.courses[0],
          courseStatus: 'draft',
          password: null,
          guides: [],
          users: [{
            ...professorProfile,
            role: 'creator'
          }],
          professors: [{
            ...professorProfile,
            role: 'creator'
          }]
        };
        response = await requests.getCourse({ token, course: expectedCourse });
      });

      it('status is OK', () => assert.equal(response.status, 200));

      it('body is the course', () => assert.deepEqual(sanitizeResponse(response.body), expectedCourse));
    });

    describe('When the course exists and has users', () => {
      let expectedCourse;
      let studentProfiles;
      let professorProfiles;

      beforeEach(async () => {
        const coursesAndCreators = await addCourseMocks({
          coursesNumber: 1,
          creator: professorProfile
        });
        const createdCourse = coursesAndCreators.courses[0];
        const students = await addCourseUserMocks({
          courseId: createdCourse.courseId, usersAmount: 3, role: 'student'
        });
        studentProfiles = students.map((u) => ({
          userId: u.userId,
          role: u.role,
          email: 'mock@email',
          name: 'mock'
        }));
        professorProfiles = [{ ...professorProfile, role: 'creator' }];

        expectedCourse = {
          ...coursesAndCreators.courses[0],
          courseStatus: 'draft',
          password: null,
          guides: [],
          users: [...professorProfiles, ...studentProfiles],
          professors: professorProfiles
        };
      });

      beforeEach(async () => {
        mocks.mockUsersService({ profile: professorProfile });
        mocks.mockUsersBulk({
          users: [...professorProfiles, ...studentProfiles],
          userProfiles: [...professorProfiles, ...studentProfiles]
        });

        response = await requests.getCourse({ token, course: expectedCourse });
      });

      it('status is OK', () => assert.equal(response.status, 200));

      it('body is the course', () => assert.deepEqual(sanitizeResponse(response.body), expectedCourse));
    });

    describe('When the course does not exist', () => {
      beforeEach(async () => {
        mocks.mockUsersService({ profile: professorProfile });

        response = await requests.getCourse({ token, course });
      });
      it('should return NOT FOUND', () => assert.equal(response.status, 404));
    });
  });

  describe('Get user courses', () => {
    describe('When there are courses', () => {
      let expectedCourses;

      describe('and the courses belongs to the user', () => {
        beforeEach(async () => {
          mocks.mockUsersService({ profile: professorProfile });
          mocks.mockUsersBulk({ users: [professorProfile], userProfiles: [professorProfile] });

          const coursesAndCreators = await addCourseMocks({
            coursesNumber: 3,
            creator: professorProfile
          });
          expectedCourses = coursesAndCreators.courses.map(($course) => ({
            ...$course,
            password: null,
            courseStatus: 'draft',
            professors: [professorProfile]
          }));
          response = await requests.getUserCourses({ token });
        });

        it('status is OK', () => assert.equal(response.status, 200));
        it('body has the course', () => assert.deepEqual(sanitizeResponse(response.body), expectedCourses));
      });

      describe('and the user is not matriculed in the course', () => {
        beforeEach(async () => {
          mocks.mockUsersService({ profile: studentProfile });

          await addCourseMocks({
            coursesNumber: 3,
            creator: professorProfile
          });
          response = await requests.getUserCourses({ token });
        });

        it('status is OK', () => assert.equal(response.status, 200));
        it('body has the course', () => assert.deepEqual(response.body, []));
      });
    });

    describe('When the user does not have courses', () => {
      beforeEach(async () => {
        await addCourseMocks({
          coursesNumber: 3,
          creator: professorProfile
        });

        mocks.mockUsersService({ profile: studentProfile });
        response = await requests.getUserCourses({ token });
      });

      it('status is OK', () => assert.equal(response.status, 200));
      it('body has the course', () => assert.deepEqual(response.body, []));
    });

    describe('When there are zero courses', () => {
      beforeEach(async () => {
        mocks.mockUsersService({ profile: professorProfile });

        response = await requests.getUserCourses({ token });
      });

      it('should return an empty array', () => {
        assert.deepEqual(response.body, []);
      });
    });
  });

  describe('Search courses', () => {
    describe('When there are courses', () => {
      describe('and they has not been published', () => {
        beforeEach(async () => {
          mocks.mockUsersService({ profile: studentProfile });

          await addCourseMocks({
            coursesNumber: 3,
            courseStatus: 'draft',
            creator: professorProfile
          });
          response = await requests.searchCourses({ token });
        });

        it('status is OK', () => assert.equal(response.status, 200));
        it('body is empty', () => assert.deepEqual(response.body, []));
      });

      describe('and they has been published', () => {
        let expectedCourses;

        beforeEach(async () => {
          mocks.mockUsersService({ profile: studentProfile });
          mocks.mockUsersBulk({ users: [professorProfile], userProfiles: [professorProfile] });

          const coursesAndCreators = await addCourseMocks({
            coursesNumber: 3,
            courseStatus: 'published',
            creator: professorProfile
          });
          expectedCourses = coursesAndCreators.courses.map(($course) => ({
            ..._.omit($course, ['password']),
            courseStatus: 'published',
            professors: [professorProfile]
          }));
          response = await requests.searchCourses({ token });
        });

        it('body has the courses', () => assert.deepEqual(sanitizeResponse(response.body), expectedCourses));
      });

      describe('and they has been published but the user is already matriculated', () => {
        beforeEach(async () => {
          mocks.mockUsersService({ profile: professorProfile });
          mocks.mockUsersBulk({ users: [professorProfile], userProfiles: [professorProfile] });

          await addCourseMocks({
            coursesNumber: 3,
            courseStatus: 'published',
            creator: professorProfile
          });

          response = await requests.searchCourses({ token });
        });

        it('body is empty', () => assert.deepEqual(response.body, []));
      });

      describe('and searching by name', () => {
        let am2;
        let am3;
        let alg;

        beforeEach(async () => {
          am2 = 'analisis2';
          am3 = 'analisis3';
          alg = 'algebra';

          await addCourseMocks({
            courseId: am2,
            name: am2,
            courseStatus: 'published',
            creator: professorProfile
          });
          await addCourseMocks({
            courseId: am3,
            name: am3,
            courseStatus: 'published',
            creator: professorProfile
          });
          await addCourseMocks({
            courseId: alg,
            name: alg,
            courseStatus: 'published',
            creator: professorProfile
          });
        });

        it('search by "analisis"', async () => {
          mocks.mockUsersService({ profile: studentProfile });
          mocks.mockUsersBulk({ users: [professorProfile], userProfiles: [professorProfile] });

          response = await requests.searchCourses({ token, search: 'analisis' });
          const courseIds = response.body.map((c) => c.courseId);

          assert.deepEqual(courseIds, [am3, am2]);
        });

        it('search by "analisis2"', async () => {
          mocks.mockUsersService({ profile: studentProfile });
          mocks.mockUsersBulk({ users: [professorProfile], userProfiles: [professorProfile] });

          response = await requests.searchCourses({ token, search: 'analisis2' });
          const courseIds = response.body.map((c) => c.courseId);

          assert.deepEqual(courseIds, [am2]);
        });

        it('search by "ANALISIS2"', async () => {
          mocks.mockUsersService({ profile: studentProfile });
          mocks.mockUsersBulk({ users: [professorProfile], userProfiles: [professorProfile] });

          response = await requests.searchCourses({ token, search: 'ANALISIS2' });
          const courseIds = response.body.map((c) => c.courseId);

          assert.deepEqual(courseIds, [am2]);
        });

        it('search by "algeb"', async () => {
          mocks.mockUsersService({ profile: studentProfile });
          mocks.mockUsersBulk({ users: [professorProfile], userProfiles: [professorProfile] });

          response = await requests.searchCourses({ token, search: 'algeb' });
          const courseIds = response.body.map((c) => c.courseId);

          assert.deepEqual(courseIds, [alg]);
        });

        it('search by "a"', async () => {
          mocks.mockUsersService({ profile: studentProfile });
          mocks.mockUsersBulk({ users: [professorProfile], userProfiles: [professorProfile] });

          response = await requests.searchCourses({ token, search: 'a' });
          const courseIds = response.body.map((c) => c.courseId);

          assert.deepEqual(courseIds, [alg, am3, am2]);
        });

        it('search by "none"', async () => {
          mocks.mockUsersService({ profile: studentProfile });
          mocks.mockUsersBulk({ users: [professorProfile], userProfiles: [professorProfile] });

          response = await requests.searchCourses({ token, search: 'none' });
          const courseIds = response.body.map((c) => c.courseId);

          assert.deepEqual(courseIds, []);
        });
      });
    });

    describe('When the user does not have courses', () => {
      beforeEach(async () => {
        await addCourseMocks({
          coursesNumber: 3,
          creator: professorProfile
        });

        mocks.mockUsersService({ profile: studentProfile });
        response = await requests.getUserCourses({ token });
      });

      it('status is OK', () => assert.equal(response.status, 200));
      it('body has the course', () => assert.deepEqual(response.body, []));
    });

    describe('When there are zero courses', () => {
      beforeEach(async () => {
        mocks.mockUsersService({ profile: professorProfile });

        response = await requests.searchCourses({ token });
      });

      it('should return an empty array', () => {
        assert.deepEqual(response.body, []);
      });
    });
  });

  describe('Update course', () => {
    let finalCourse;

    describe('When the course exists', () => {
      beforeEach(async () => {
        mocks.mockUsersService({ profile: professorProfile });

        const coursesAndCreators = await addCourseMocks({
          coursesNumber: 1,
          creator: professorProfile
        });
        const [firstCourse] = coursesAndCreators.courses;

        const name = 'curso';
        const description = 'un curso mas';
        finalCourse = {
          courseId: firstCourse.courseId,
          name,
          description,
          password: null,
          guides: [],
          courseStatus: 'draft',
          users: [{
            ...professorProfile,
            role: 'creator'
          }],
          professors: [{
            ...professorProfile,
            role: 'creator'
          }]
        };

        response = await requests.updateCourse({ course: finalCourse, token });
      });

      it('should return status OK', () => assert.equal(response.status, 200));

      it('get course should return the course updated', async () => {
        mocks.mockUsersService({ profile: professorProfile });
        mocks.mockUsersBulk({ users: [professorProfile], userProfiles: [professorProfile] });

        response = await requests.getCourse({ course: finalCourse, token });
        assert.deepEqual(sanitizeResponse(response.body), finalCourse);
      });
    });

    describe('When the user does not have permission', () => {
      beforeEach(async () => {
        mocks.mockUsersService({ profile: professorProfile });

        const coursesAndCreators = await addCourseMocks({
          coursesNumber: 1, creator: { userId: 'anotherCreator' }
        });
        const [otherCourse] = coursesAndCreators.courses;

        response = await requests.updateCourse({ course: otherCourse, token });
      });

      it('should return Forbidden', () => assert.equal(response.status, 403));
    });

    describe('When the course does not exist', () => {
      beforeEach(async () => {
        mocks.mockUsersService({ profile: professorProfile });

        response = await requests.updateCourse({
          course: { courseId: 'inexistent', name: 'new name', description: 'new description' },
          token
        });
      });

      it('should return NOT FOUND', () => assert.equal(response.status, 404));
    });
  });

  describe('Publish course', () => {
    let createdCourse;

    describe('When the course exists', () => {
      beforeEach(async () => {
        mocks.mockUsersService({ profile: professorProfile });

        const coursesAndCreators = await addCourseMocks({
          coursesNumber: 1,
          creator: professorProfile
        });
        [createdCourse] = coursesAndCreators.courses;

        response = await requests.publishCourse({ course: createdCourse, token });
      });

      it('should return status OK', () => assert.equal(response.status, 200));

      it('get course should return the course updated', async () => {
        mocks.mockUsersService({ profile: professorProfile });
        mocks.mockUsersBulk({ users: [professorProfile], userProfiles: [professorProfile] });

        const expectedCourse = {
          ...createdCourse,
          password: null,
          guides: [],
          courseStatus: 'published',
          users: [{
            ...professorProfile,
            role: 'creator'
          }],
          professors: [{
            ...professorProfile,
            role: 'creator'
          }]
        };

        response = await requests.getCourse({ course: createdCourse, token });
        assert.deepEqual(sanitizeResponse(response.body), expectedCourse);
      });

      it('search course should find it', () => {
        beforeEach(async () => {
          mocks.mockUsersService({ profile: studentProfile });
          mocks.mockUsersBulk({ users: [professorProfile], userProfiles: [professorProfile] });

          response = await requests.searchCourses({ token });
        });

        it('body has the published', () => assert.deepEqual(sanitizeResponse(response.body[0].courseId), createdCourse.courseId));
      });
    });
  });
});
