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
    let expectedCourse;
    // Set up database
    beforeEach(async () => {
      expectedCourse = {
        id: 'coursename2',
        name: 'course name 2',
        description: 'course description 2',
      };
      await addThreeMocks();
    });

    beforeEach(async () => {
      response = await requests.getCourse({ token: fakeToken, id: expectedCourse.id });
    });

    it('status is OK', () => assert.equal(response.status, 200));

    it('body has the course', () => assert.deepEqual(response.body, expectedCourse));
  });
});
