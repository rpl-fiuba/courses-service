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
