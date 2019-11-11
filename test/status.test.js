const { assert } = require('chai');
const requests = require('./utils/coursesRequests');

// Starts the app
require('../src/app.js');

describe('Integration status tests', () => {
  describe('Status', () => {
    let response;

    beforeEach(async () => {
      response = await requests.status();
    });

    it('GET status', () => assert.equal(response.status, 200));
  });
});
