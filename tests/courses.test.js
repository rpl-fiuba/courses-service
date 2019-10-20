const { assert } = require('chai');
const requests = require('./utils/requests');
const { knex, cleanDb } = require('./utils/db');

// Starts the app
require('../src/app.js');

describe('Integration courses tests', () => {
  let response;
  const fakeToken = 'diego';

  before(() => cleanDb());
  afterEach(() => cleanDb());

  describe('Get courses', () => {
    describe('When there are courses', () => {
      let expectedCourses;
      // Set up database
      beforeEach(async () => {
        expectedCourses = [
          {
            id: 'coursename2',
            name: 'course name 2',
            description: 'course description 2',
          },
          {
            id: 'coursename1',
            name: 'course name 1',
            description: 'course description 1',
          },
        ];

        await knex('courses').del();
        await knex('courses').insert([
          {
            id: 'coursename1',
            name: 'course name 1',
            description: 'course description 1',
          },
          {
            id: 'coursename2',
            name: 'course name 2',
            description: 'course description 2',
          },
          {
            id: 'coursename3',
            name: 'course name 3',
            description: 'course description 3',
          },
        ]);
        await knex('course_users').del();
        await knex('course_users').insert([
          {
            course_id: 'coursename2',
            user_id: 'diego',
            role: 'admin'
          },
          {
            course_id: 'coursename1',
            user_id: 'diego',
            role: 'admin'
          },
          {
            course_id: 'coursename3',
            user_id: 'pedro',
            role: 'admin'
          },
          {
            course_id: 'coursename3',
            user_id: 'joaco',
            role: 'student'
          },
        ]);
        await knex('guides').del();
        await knex('guides').insert([
          {
            course_id: 'coursename',
            guide_id: 'guide id',
            description: 'description',
          },
        ]);
      });

      beforeEach(async () => {
        response = await requests.getCourses({ token: fakeToken });
      });

      it('status is OK', () => assert.equal(response.status, 200));

      it('body has the course', () => assert.deepEqual(response.body, expectedCourses));
    });
  });

  describe('Add course', () => {
    let courseToBeAdded;

    beforeEach(() => {
      const name = 'curso';
      const description = 'un curso mas';
      courseToBeAdded = { name, description, id: name };
    });

    describe('When is successfully added', () => {
      beforeEach(async () => {
        response = await requests.addCourse({
          name: courseToBeAdded.name,
          description: courseToBeAdded.description,
          token: fakeToken
        });
      });

      it('status is OK', () => assert.equal(response.status, 201));

      it('get course should return the course added', async () => {
        response = await requests.getCourses({ token: fakeToken });
        // const courses = response.body;
        assert.equal(response.status, 200);
      });
    });
  });
});
