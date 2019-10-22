const { assert } = require('chai');
const requests = require('./utils/requests');
const { addThreeMocks, cleanDb } = require('./utils/db');

// Starts the app
require('../src/app.js');


describe('Get courses', () => {
  let response;
  const fakeToken = 'diego';

  before(() => cleanDb());
  afterEach(() => cleanDb());
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
      await addThreeMocks();
    });

    beforeEach(async () => {
      response = await requests.getCourses({ token: fakeToken });
    });

    it('status is OK', () => assert.equal(response.status, 200));

    it('body has the course', () => assert.deepEqual(response.body, expectedCourses));
  });
});
