const { assert } = require('chai');
const requests = require('./utils/requests');
const { addThreeMocks, cleanDb } = require('./utils/db');

// Starts the app
require('../src/app.js');


describe('Delete course', () => {
  let response;
  const fakeToken = 'diego';

  before(() => cleanDb());
  afterEach(() => cleanDb());
  describe('When there are courses', () => {
    let courseToDelete;
    // Set up database
    beforeEach(async () => {
      courseToDelete = {
        id: 'coursename2',
        name: 'course name 2',
        description: 'course description 2',
      };
      await addThreeMocks();
    });

    beforeEach(async () => {
      response = await requests.deleteCourse({ token: fakeToken, id: courseToDelete.id });
    });

    it('status is OK', () => assert.equal(response.status, 200));

    it('get deleted course returns 404', async () => {
      response = await requests.getCourse({ id: courseToDelete.id, token: fakeToken });
      assert.deepEqual(response.status, 404);
    });
  });
});
