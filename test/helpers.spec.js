const nock = require('nock');
const logger = require('@elastic.io/component-logger')();
const { expect } = require('chai');
const { calculateNextResetTime, isNextResetTimeCome, rateLimit } = require('../lib/helpers/helpers');

const context = {
  logger,
};

describe('helpers test', () => {
  it('calculateNextResetTime', async () => {
    const result = await calculateNextResetTime(3);
    expect(new Date(result)).equal('2020-05-18T17:57:09.292Z');
  });

  it('isNextResetTimeCome', async () => {
    const result = await isNextResetTimeCome('2020-06-18T17:57:09.292Z');
    expect(result).equal(true);
  });

  describe('rateLimit', async () => {
    process.env.ELASTICIO_OBJECT_STORAGE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRJZCI6IjU2YzIwN2FkYjkxMjExODFlNjUwYzBlZiIsImNvbnRyYWN0SWQiOiI1YjVlZDFjZjI3MmNmODAwMTFhZTdiNmEiLCJ3b3Jrc3BhY2VJZCI6IjVhNzFiZmM1NjA3ZjFiMDAwNzI5OGEyYSIsImZsb3dJZCI6IioiLCJ1c2VySWQiOiI1YjE2NGRiMzRkNTlhODAwMDdiZDQ3OTMiLCJpYXQiOjE1ODg1ODg3NjZ9.3GlJAwHz__e2Y5tgkzD1t-JyhgXGJOSVFSLUBCqLh5Y';
    process.env.ELASTICIO_WORKSPACE_ID = 'test';
    process.env.ELASTICIO_FLOW_ID = 'test';
    process.env.ELASTICIO_API_URI = 'https://api.hostname';
    process.env.ELASTICIO_OBJECT_STORAGE_URI = 'http://localhost:3002';
    it('create new object', async () => {
      const getBucket = nock('http://localhost:3002', { encodedQueryParams: true })
        .get('/buckets')
        .query({ externalId: 'test_test' })
        .reply(200, {
          data: [],
        });

      const postBucket = nock('http://localhost:3002')
        .post('/buckets', {
          objects: [],
          externalId: 'test_test',
        })
        .reply(200, {
          data: [{
            id: '5eb12cf334355600166f87a1',
            objects: [
            ],
            externalId: 'test_test',
            closed: false,
            createdAt: 1588669683629,
          }],
          meta: {
            page: 1, perPage: 25, total: 1, totalPages: 1,
          },
        });

      const postObject = nock('http://localhost:3002', { encodedQueryParams: true })
        .post('/objects')
        .reply(201, {
          contentLength: 153,
          contentType: 'application/octet-stream',
          createdAt: 1588674648766,
          md5: '4e9111f2682a71f03f73c3070f6e3fcb',
          objectId: 'add12691-fc56-4b57-8ef3-56c962614671',
          metadata: { bucket: '5eb12cf334355600166f87a1' },
        });
      const options = {
        windowMs: 60 * 1000,
        externalId: 'test_test',
        max: 10,
      };
      const result = await rateLimit(context, options);
      expect(result).equal(true);
      expect(getBucket.isDone()).to.equal(true);
      expect(postBucket.isDone()).to.equal(true);
      expect(postObject.isDone()).to.equal(true);
    });

    it('object created', async () => {
      const getBucket = nock('http://localhost:3002', { encodedQueryParams: true })
        .get('/buckets')
        .times(2)
        .query({ externalId: 'test_test' })
        .reply(200, {
          data: [{
            id: '5eb12cf334355600166f87a1',
            objects: [
            ],
            externalId: 'test_test',
            closed: false,
            createdAt: 1588669683629,
          }],
        });

      const postObject = nock('http://localhost:3002', { encodedQueryParams: true })
        .post('/objects')
        .reply(201, {
          contentType: 'application/octet-stream',
          createdAt: 1588674648766,
          md5: '4e9111f2682a71f03f73c3070f6e3fcb',
          objectId: 'add12691-fc56-4b57-8ef3-56c962614671',
          metadata: { bucket: '5eb12cf334355600166f87a1' },
        });
      const options = {
        windowMs: 60 * 1000,
        externalId: 'test_test',
        max: 10,
      };
      const result = await rateLimit(context, options);
      expect(result).equal(true);
      expect(getBucket.isDone()).to.equal(true);
      expect(postObject.isDone()).to.equal(true);
    });

    it('object exists', async () => {
      const getBucket = nock('http://localhost:3002', { encodedQueryParams: true })
        .get('/buckets')
        .times(2)
        .query({ externalId: 'test_test' })
        .reply(200, {
          data: [{
            id: '5eb12cf334355600166f87a1',
            objects: [
              '1',
            ],
            externalId: 'test_test',
            closed: false,
            createdAt: 1588669683629,
          }],
        });

      const getObject = nock('http://localhost:3002', { encodedQueryParams: true })
        .get('/objects/1')
        .reply(200, {
          nextResetTime: new Date('2040-06-19T06:24:32.915Z'),
          hits: 2,
        });

      const postObject = nock('http://localhost:3002', { encodedQueryParams: true })
        .post('/objects')
        .reply(201, {
          objectId: 'add12691-fc56-4b57-8ef3-56c962614671',
          metadata: { bucket: '5eb12cf334355600166f87a1' },
        });

      const deleteObject = nock('http://localhost:3002', { encodedQueryParams: true })
        .delete('/objects/1')
        .reply(201, {});
      const options = {
        windowMs: 60 * 1000,
        externalId: 'test_test',
        max: 10,
      };
      const result = await rateLimit(context, options);
      expect(result).equal(true);
      expect(getBucket.isDone()).to.equal(true);
      expect(postObject.isDone()).to.equal(true);
      expect(getObject.isDone()).to.equal(true);
      expect(deleteObject.isDone()).to.equal(true);
    });
  });
});
