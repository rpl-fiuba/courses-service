const { assert } = require('chai');
const requests = require('./utils/guidesRequests');
const usersRequests = require('./utils/usersRequests');
const { cleanDb } = require('./utils/db');
const { addCourseMocks, addGuideMocks } = require('./utils/dbMockFactory');
const mocks = require('./utils/mocks');

describe('Guides Tests', () => {
  let response;
  const token = 'diego';
  let guide;
  let courseId;

  before(cleanDb);
  beforeEach(async () => {
    mocks.mockUsersService();
    const coursesAndCreators = await addCourseMocks({ coursesNumber: 1, creatorId: token, });
    courseId = coursesAndCreators.courses[0].courseId;
    guide = {
      courseId,
      guideId: 'guia1',
      name: 'guia 1',
      description: 'primera guia de la materia'
    };
  });
  afterEach(() => cleanDb());

  describe('Add guide', () => {
    describe('When is successfully added', () => {
      beforeEach(async () => {
        response = await requests.addGuide({ token, guide });
      });

      it('status is CREATED', () => assert.equal(response.status, 201));
      it('body contains the course', () => assert.deepEqual(response.body, guide));
    });

    describe('When the course does not exist', () => {
      beforeEach(async () => {
        guide = {
          courseId: 'nonexistent',
          guideId: 'guia1',
          name: 'guia 1',
          description: 'primera guia de la materia'
        };
        response = await requests.addGuide({ courseId: guide.courseId, token, guide });
      });

      it('should return BAD REQUEST', () => assert.equal(response.status, 400));
    });

    // TODO: do this cases
    describe('When the user do not have permissions over the course', () => {
      beforeEach(async () => {
        response = await requests.addGuide({ token: 'anotherToken', guide });
      });

      it('should return Forbidden', () => assert.equal(response.status, 403));
    });

    describe('When there are missing fields', () => {
      describe('when the name is missing', () => {
        beforeEach(async () => {
          guide = {
            courseId,
            name: 'guia 1',
          };
          response = await requests.addGuide({ token, guide });
        });

        it('it should return BAD REQUEST', () => {
          assert.equal(response.status, 400);
        });
      });

      describe('when the description is missing', () => {
        beforeEach(async () => {
          guide = {
            courseId,
            name: 'guia 1',
          };
          response = await requests.addGuide({ token, guide });
        });

        it('it should return BAD REQUEST', () => {
          assert.equal(response.status, 400);
        });
      });
    });

    describe('When the guide already exist', () => {
      beforeEach(async () => {
        response = await requests.addGuide({ token, guide });
        response = await requests.addGuide({ token, guide });
      });

      it('should return status CONFLICT', () => assert.equal(response.status, 409));
    });
  });

  describe('Delete guide', () => {
    describe('When the guide exists', () => {
      beforeEach(async () => {
        [guide] = await addGuideMocks({ courseId: guide.courseId, guidesAmount: 1, });
        response = await requests.deleteGuide({ guide, token });
      });

      it('status should be OK', () => assert.equal(response.status, 200));
      it('get guide should return not found', async () => {
        response = await requests.getGuide({ guide, token });
        assert.equal(response.status, 404);
      });
    });
  });

  describe('Get guides', () => {
    describe('When there are guides', () => {
      let guides;
      beforeEach(async () => {
        guides = await addGuideMocks({
          courseId: guide.courseId,
          guidesAmount: 1,
        });
        response = await requests.getGuides({ courseId: guide.courseId, token });
      });

      it('status should be OK', () => assert.equal(response.status, 200));
      it('should return the existing guides', () => {
        const expectedGuides = guides.map(($guide) => ({
          ...$guide,
          guideStatus: 'draft'
        }));
        assert.deepEqual(response.body, expectedGuides);
      });
    });

    describe('When there are zero guides', () => {
      beforeEach(async () => {
        response = await requests.getGuides({ courseId: 'id', token });
      });

      it('should return NOT FOUND', () => assert.equal(response.status, 404));
    });
  });

  describe('Update guide', () => {
    let guides;
    let finalGuide;

    describe('When the new guide data is correct and existed before', () => {
      beforeEach(async () => {
        guides = await addGuideMocks({ courseId, guidesAmount: 1, });
        [finalGuide] = guides;
        finalGuide = {
          ...finalGuide,
          name: 'new name',
          description: 'new description'
        };
        response = await requests.updateGuide({ guide: finalGuide, token, });
      });

      it('status should be OK', () => assert.equal(response.status, 200));
      it('should return the existing guides', () => {
        assert.deepEqual(response.body, finalGuide);
      });
    });

    describe('When the guide does not exist', () => {
      beforeEach(async () => {
        response = await requests.updateGuide({
          token,
          guide: { ...guide, guideId: 'inexistent' },
        });
      });

      it('should return NOT FOUND', () => assert.equal(response.status, 404));
    });

    describe('When the user does not have permission', () => {
      beforeEach(async () => {
        guides = await addGuideMocks({
          courseId,
          guidesAmount: 1,
        });
        [finalGuide] = guides;
        response = await requests.updateGuide({
          guide: finalGuide,
          token: 'anotherToken',
        });
      });

      it('should return Forbidden', () => assert.equal(response.status, 403));
    });

    describe('When a professor of the course tries to update', () => {
      beforeEach(async () => {
        guides = await addGuideMocks({ courseId, guidesAmount: 1, });
        [finalGuide] = guides;
        finalGuide = {
          ...finalGuide,
          name: 'new name',
          description: 'new description'
        };
        const professorUser = { courseId, userId: 'pepe', role: 'professor' };
        await usersRequests.addUser({ user: professorUser, token });
        response = await requests.updateGuide({ guide: finalGuide, token: professorUser.userId });
      });

      it('status should be OK', () => assert.equal(response.status, 200));
      it('should return the existing guides', () => {
        assert.deepEqual(response.body, finalGuide);
      });
    });
  });
});
