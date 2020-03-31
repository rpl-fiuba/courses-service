const chai = require('chai');

const { assert, expect } = chai;
const deepEqualInAnyOrder = require('deep-equal-in-any-order');
const requests = require('./utils/usersRequests');
const courseRequests = require('./utils/coursesRequests');
const { cleanDb } = require('./utils/db');
const { addCourseMocks, addCourseUserMocks, addUsersActivity } = require('./utils/dbMockFactory');
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
      let courseId;
      let userProfiles;

      // Set up database
      beforeEach(async () => {
        mocks.mockUsersService({ profile: professorProfile });

        const coursesAndCreators = await addCourseMocks({
          coursesNumber: 1, creator: professorProfile
        });
        courseId = coursesAndCreators.courses[0].courseId;

        const mockUsers = await addCourseUserMocks({ courseId, usersAmount: 3, role: 'student' });
        userProfiles = mockUsers.map((u) => ({
          userId: u.userId,
          role: u.role,
          email: 'mock@email',
          name: 'mock'
        }));
        mocks.mockUsersBulk({ users: [professorProfile, ...mockUsers], userProfiles });

        response = await requests.getUsers({ token, courseId });
      });

      it('status is OK', () => assert.equal(response.status, 200));

      it('body has the expected users', () => expect(response.body).to.deep.equalInAnyOrder(userProfiles));
    });
  });

  describe('Get Users activity', () => {
    let courseId;
    let mockUsers;
    let expectedResponse;

    beforeEach(async () => {
      mocks.mockUsersService({ profile: professorProfile });

      // creating course
      const coursesAndCreators = await addCourseMocks({
        coursesNumber: 1, creator: professorProfile
      });
      const [createdCourse] = coursesAndCreators.courses;
      courseId = createdCourse.courseId;

      // creating users
      mockUsers = await addCourseUserMocks({ courseId, usersAmount: 10, role: 'student' });
      const userIds = mockUsers.map((u) => u.userId);

      // adding users activity
      const years = [2019, 2018];
      const months = [2, 1];
      const days = [15, 11, 10, 4, 2, 1];

      const activities = [];
      expectedResponse = [];

      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1;
      const currentDay = today.getDate();
      const daysByCurrentMonth = new Date(currentYear, currentMonth, 0).getDate();

      const currentExpectedDays = [];
      for (let day = 1; day <= daysByCurrentMonth; day += 1) {
        if (currentDay !== day) {
          currentExpectedDays.push({ day, count: 0 });
        } else {
          currentExpectedDays.push({ day, count: 1 });
        }
      }
      // saving the current activity day (because the current user makes an action)
      expectedResponse.push({
        year: currentYear,
        months: [{ month: currentMonth, days: currentExpectedDays }]
      });

      // saving the users activity days
      years.forEach((year) => {
        const expectedMonths = [];

        months.forEach((month) => {
          const expectedDays = [];

          const daysByMonth = new Date(year, month, 0).getDate();
          for (let day = 1; day <= daysByMonth; day += 1) {
            if (!days.includes(day)) {
              expectedDays.push({ day, count: 0 });
            } else {
              expectedDays.push({ day, count: 10 });
            }
          }
          expectedMonths.push({ month, days: expectedDays });

          days.forEach((day) => {
            const newDate = new Date(year, month - 1, day);

            userIds.forEach((userId) => {
              activities.push({
                user_id: userId, course_id: courseId, activity_date: newDate.toDateString()
              });
            });
          });
        });

        expectedResponse.push({ year, months: expectedMonths });
      });

      await addUsersActivity({ activities });

      response = await requests.getUsersActivity({ token, courseId });
    });

    it('status is OK', () => assert.equal(response.status, 200));

    it('body has the expected activity', () => expect(response.body).to.deep.equal(expectedResponse));

    describe('when an user does some action in the course', () => {
      beforeEach(async () => {
        mocks.mockUsersService({ profile: studentProfile });
        mocks.mockUsersBulk({
          users: [professorProfile, ...mockUsers],
          userProfiles: [professorProfile, ...mockUsers]
        });

        // doing some activity
        await courseRequests.getCourse({ token, course: { courseId } });

        // increasing the activity count (only in one)
        const currentDay = (new Date()).getDate();
        expectedResponse[0].months[0].days.find((dayObj) => dayObj.day === currentDay).count += 1;

        mocks.mockUsersService({ profile: professorProfile });
        response = await requests.getUsersActivity({ token, courseId });
      });

      it('status is OK', () => assert.equal(response.status, 200));

      it('body has the expected activity', () => expect(response.body).to.deep.equal(expectedResponse));
    });
  });
});
