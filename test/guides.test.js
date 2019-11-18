const { assert } = require('chai');
const requests = require('./utils/guidesRequests');
const usersRequests = require('./utils/usersRequests');
const { cleanDb, sanitizeResponse } = require('./utils/db');
const { addCourseMocks, addGuideMocks } = require('./utils/dbMockFactory');
const mocks = require('./utils/mocks');

describe('Guides Tests', () => {
  const token = 'diego';
  let response;
  let guide;
  let courseId;
  let studentProfile;
  let professorProfile;

  before(cleanDb);
  beforeEach(async () => {
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
    const coursesAndCreators = await addCourseMocks({
      coursesNumber: 1,
      creator: professorProfile
    });
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
        mocks.mockUsersService({ profile: professorProfile });

        response = await requests.addGuide({ token, guide });
      });

      it('status is CREATED', () => assert.equal(response.status, 201));
      it('body contains the course', () => assert.deepEqual(response.body, guide));
    });

    describe('When the course does not exist', () => {
      beforeEach(async () => {
        mocks.mockUsersService({ profile: professorProfile });

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

    describe('When the user do not have permissions over the course', () => {
      beforeEach(async () => {
        mocks.mockUsersService({ profile: studentProfile });

        response = await requests.addGuide({ token, guide });
      });

      it('should return Forbidden', () => assert.equal(response.status, 403));
    });

    describe('When there are missing fields', () => {
      describe('when the name is missing', () => {
        beforeEach(async () => {
          mocks.mockUsersService({ profile: professorProfile });

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
          mocks.mockUsersService({ profile: professorProfile });

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
        mocks.mockUsersService({ profile: professorProfile, times: 2 });

        response = await requests.addGuide({ token, guide });
        response = await requests.addGuide({ token, guide });
      });

      it('should return status CONFLICT', () => assert.equal(response.status, 409));
    });
  });

  describe('Delete guide', () => {
    describe('When the guide exists', () => {
      beforeEach(async () => {
        mocks.mockUsersService({ profile: professorProfile });

        [guide] = await addGuideMocks({ courseId: guide.courseId, guidesAmount: 1, });
        response = await requests.deleteGuide({ guide, token });
      });

      it('status should be OK', () => assert.equal(response.status, 204));

      it('get guide should return not found', async () => {
        mocks.mockUsersService({ profile: professorProfile });

        response = await requests.getGuide({ guide, token });
        assert.equal(response.status, 404);
      });
    });
  });

  describe('Get guides', () => {
    describe('When there are guides', () => {
      let guides;
      beforeEach(async () => {
        mocks.mockUsersService({ profile: professorProfile });

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
          guideStatus: 'draft' // TODO: NO LE PONDRIA STATUS A LAS GUIDES
        }));
        assert.deepEqual(sanitizeResponse(response.body), expectedGuides);
      });
    });

    describe('When there are zero guides', () => {
      beforeEach(async () => {
        mocks.mockUsersService({ profile: professorProfile });

        response = await requests.getGuides({ courseId: 'id', token });
      });

      it('should return OK', () => assert.equal(response.status, 200));

      it('should return an empty array', () => {
        assert.deepEqual(sanitizeResponse(response.body), []);
      });
    });
  });

  describe('Update guide', () => {
    let guides;
    let finalGuide;

    describe('When the new guide data is correct and existed before', () => {
      beforeEach(async () => {
        mocks.mockUsersService({ profile: professorProfile });

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
        mocks.mockUsersService({ profile: professorProfile });

        response = await requests.updateGuide({
          token,
          guide: { ...guide, guideId: 'inexistent' },
        });
      });

      it('should return NOT FOUND', () => assert.equal(response.status, 404));
    });

    describe('When the user does not have permission', () => {
      beforeEach(async () => {
        mocks.mockUsersService({ profile: studentProfile });

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

    describe('When another professor of the course tries to update', () => {
      beforeEach(async () => {
        mocks.mockUsersService({ profile: professorProfile, times: 2 });

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
