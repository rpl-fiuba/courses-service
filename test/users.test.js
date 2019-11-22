const chai = require('chai');

const { assert, expect } = chai;
const deepEqualInAnyOrder = require('deep-equal-in-any-order');
const requests = require('./utils/usersRequests');
const { cleanDb } = require('./utils/db');
const { addCourseMocks, addCourseUserMocks } = require('./utils/dbMockFactory');
const mocks = require('./utils/mocks');

chai.use(deepEqualInAnyOrder);

process.env.NODE_ENV = 'test';
require('../src/app.js');

describe('Users Tests', () => {
  const token = 'fakeToken';
  let response;
  let user;
  let expectedUser;
  let studentProfile;
  let professorProfile;

  before(cleanDb);
  beforeEach(() => {
    user = {};
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

  describe('Add User to course', () => {
    describe('When the user is student and doesnt exist', () => {
      describe('when the course does not have password', () => {
        beforeEach(async () => {
          mocks.mockUsersService({ profile: studentProfile });

          const coursesAndCreators = await addCourseMocks({
            coursesNumber: 1,
            creator: professorProfile
          });
          const { courseId } = coursesAndCreators.courses[0];
          user = {
            courseId,
            role: 'student',
            userId: studentProfile.userId
          };
          expectedUser = user;
          response = await requests.addUser({ user, token });
        });

        it('should return status CREATED', () => assert.equal(response.status, 201));
        it('the user should exist in the db after adding it', async () => {
          mocks.mockUsersService({ profile: professorProfile });

          response = await requests.getUser({ user, token });
          assert.deepEqual(response.body, user);
        });
      });

      describe('when the course has password and it is ok', () => {
        let coursePassword;

        beforeEach(async () => {
          mocks.mockUsersService({ profile: studentProfile });

          coursePassword = 'passs';
          const coursesAndCreators = await addCourseMocks({
            coursesNumber: 1,
            password: coursePassword,
            creator: professorProfile
          });
          const { courseId } = coursesAndCreators.courses[0];
          user = {
            courseId,
            role: 'student',
            password: coursePassword,
            userId: studentProfile.userId
          };
          expectedUser = {
            courseId,
            role: 'student',
            userId: studentProfile.userId
          };
          response = await requests.addUser({ user, token });
        });

        it('should return status CREATED', () => assert.equal(response.status, 201));
        it('the user should exist in the db after adding it', async () => {
          mocks.mockUsersService({ profile: professorProfile });

          response = await requests.getUser({ user, token });
          assert.deepEqual(response.body, expectedUser);
        });
      });

      describe('when the course has password and it is wrong', () => {
        let coursePassword;

        beforeEach(async () => {
          mocks.mockUsersService({ profile: studentProfile });

          coursePassword = 'passs';
          const coursesAndCreators = await addCourseMocks({
            coursesNumber: 1,
            password: coursePassword,
            creator: professorProfile
          });
          const { courseId } = coursesAndCreators.courses[0];
          user = {
            courseId,
            role: 'student',
            password: 'wrong password',
            userId: studentProfile.userId
          };
          response = await requests.addUser({ user, token });
        });

        it('should return status CREATED', () => assert.equal(response.status, 409));
      });
    });

    describe('When the user already exists', () => {
      beforeEach(async () => {
        mocks.mockUsersService({ profile: studentProfile, times: 2 });

        const coursesAndCreators = await addCourseMocks({
          coursesNumber: 1,
          creator: professorProfile
        });
        const { courseId } = coursesAndCreators.courses[0];
        user = {
          courseId,
          role: 'student',
          userId: studentProfile.userId
        };
        response = await requests.addUser({ user, token });
        response = await requests.addUser({ user, token });
      });

      it('should return status CONFLICT', () => assert.equal(response.status, 409));
    });

    describe('When there are missing fields', () => {
      beforeEach(async () => {
        mocks.mockUsersService({ profile: professorProfile });

        const coursesAndCreators = await addCourseMocks({
          coursesNumber: 1,
          creator: professorProfile
        });
        const { courseId } = coursesAndCreators.courses[0];
        const userWithoutRole = { courseId, userId: token, };
        response = await requests.addUser({ user: userWithoutRole, token });
      });

      it('should return BAD REQUEST', async () => {
        assert.equal(response.status, 400);
      });
    });

  // TODO: who can add users to a course? if the role is student,
  // we should check that the same user is added by self as student. If not, the profesor
  });

  describe('Delete User', () => {
    describe('When the user exists', () => {
      beforeEach(async () => {
        mocks.mockUsersService({ profile: professorProfile });

        const coursesAndCreators = await addCourseMocks({
          coursesNumber: 1,
          creator: professorProfile
        });
        const { courseId } = coursesAndCreators.courses[0];
        [user] = coursesAndCreators.creators.filter((c) => c.courseId === courseId);
        response = await requests.deleteUser({ user, token });
      });

      it('should return status 200', () => assert.equal(response.status, 204));
      it('get user should return 404 after deleting the user', async () => {
        mocks.mockUsersService({ profile: professorProfile });

        response = await requests.getUser({ user, token });
        assert.equal(response.status, 404);
      });
    });
  });

  describe('Get User', () => {
    describe('When the user exists', () => {
      beforeEach(async () => {
        mocks.mockUsersService({ profile: professorProfile });

        const coursesAndCreators = await addCourseMocks({
          coursesNumber: 1,
          creator: professorProfile
        });
        const { courseId } = coursesAndCreators.courses[0];
        [user] = coursesAndCreators.creators.filter((c) => c.courseId === courseId);
        response = await requests.getUser({ user, token });
      });

      it('should return status 200', () => assert.equal(response.status, 200));
      it('response body should be the user', () => assert.deepEqual(response.body, user));
    });
    // TODO: border cases. think about who can access this data.
  });

  describe('Update User', () => {
    describe('When the user exists', () => {
      beforeEach(async () => {
        mocks.mockUsersService({ profile: professorProfile });

        const coursesAndCreators = await addCourseMocks({
          coursesNumber: 1,
          creator: professorProfile
        });
        const { courseId } = coursesAndCreators.courses[0];
        [user] = coursesAndCreators.creators.filter((c) => c.courseId === courseId);
        user.role = 'professor';
        response = await requests.updateUser({ user, token });
      });

      it('should return status 200', () => assert.equal(response.status, 200));
      it('get user should return the updated user', async () => {
        mocks.mockUsersService({ profile: professorProfile });

        response = await requests.getUser({ user, token });
        assert.deepEqual(response.body, user);
      });
    });

    // TODO: analyze this issue. Should the admin be the only one capable of updating an user role?
  });

  describe('Get Users', () => {
    describe('When there are courses', () => {
      let expectedUsers;
      let courseId;

      // Set up database
      beforeEach(async () => {
        mocks.mockUsersService({ profile: professorProfile });

        const coursesAndCreators = await addCourseMocks({
          coursesNumber: 1,
          creator: professorProfile
        });
        courseId = coursesAndCreators.courses[0].courseId;
        const creator = coursesAndCreators.creators.filter((c) => c.courseId === courseId)[0];
        const mockUsers = await addCourseUserMocks({ courseId, usersAmount: 3, role: 'student' });
        expectedUsers = [creator];
        mockUsers.forEach((u) => expectedUsers.push(u));
        response = await requests.getUsers({ token, courseId });
      });

      it('status is OK', () => assert.equal(response.status, 200));

      it('body has the course', () => expect(response.body).to.deep.equalInAnyOrder(expectedUsers));
    });
  });
});
