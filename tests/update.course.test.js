const { assert } = require('chai');
const requests = require('./utils/requests');
const { cleanDb } = require('./utils/db');

// Starts the app
require('../src/app.js');

describe('Add course', () => {
  let response;
  const fakeToken = 'diego';

  before(() => cleanDb());
  afterEach(() => cleanDb());

  let finalCourse;

  beforeEach(() => {
    const name = 'curso';
    const description = 'un curso mas';
    // TODO: course id when changing name
    finalCourse = { id: 'initialcourse', name, description };
  });

  describe('When is successfully added', () => {
    beforeEach(async () => {
      await requests.addCourse({
        name: 'initial course',
        description: 'first description',
        token: fakeToken
      });
      response = await requests.updateCourse({
        id: finalCourse.id,
        name: finalCourse.name,
        description: finalCourse.description,
        token: fakeToken
      });
    });

    it('status is OK', () => assert.equal(response.status, 200));

    it('get course should return the course updated', async () => {
      response = await requests.getCourse({ id: finalCourse.id, token: fakeToken });
      assert.deepEqual(response.body, finalCourse);
    });
  });
});
