/* eslint-disable max-len */
const { Bucket, Client } = require('@elastic.io/maester-client');

module.exports = class MaesterClient {
  constructor(context) {
    this.logger = context.logger;
    if (!process.env.ELASTICIO_OBJECT_STORAGE_TOKEN || !process.env.ELASTICIO_OBJECT_STORAGE_URI) {
      throw new Error('Can not find storage token or storage uri values... Check environment variables');
    }
    this.token = process.env.ELASTICIO_OBJECT_STORAGE_TOKEN;
    this.url = process.env.ELASTICIO_OBJECT_STORAGE_URI;
    this.maesterClient = new Client(this.url, this.token);
  }

  async createBucketIfNotExists(externalId) {
    const list = await this.maesterClient.buckets.list({
      externalId,
    });
    let bucket;
    if (list.data.length === 0) {
      this.logger.debug('Did not find any buckets with externalId: %s. Lets create the new one', externalId);
      const response = await this.maesterClient.buckets.client(
        {
          url: '/buckets',
          method: 'post',
          data: {
            objects: [],
            externalId,
          },
        },
      );
      bucket = new Bucket(response.data);
    } else {
      [bucket] = list.data;
    }
    this.bucketId = bucket.id;
    this.logger.trace('Bucket: %j', bucket);
    return bucket;
  }

  async getObjectById(objectId) {
    const object = await this.maesterClient.objects.get(objectId);
    this.logger.info('Object: %j', object);
    return object;
  }

  async getObjectFromBucket(externalId) {
    const bucket = await this.createBucketIfNotExists(externalId);
    const { objects } = bucket;
    if (objects.length > 1) {
      throw new Error('Only one object can be stored in current bucket');
    }
    if (objects.length === 0) {
      return null;
    }
    const id = objects[0];
    const object = await this.getObjectById(id);
    return { id, ...object.data };
  }

  async createObject(data) {
    const createdObject = await this.maesterClient.objects.create(JSON.stringify(data), { bucket: this.bucketId });
    this.logger.trace('Object: %j created and saved to the bucket %s', createdObject, this.bucketId);
    return createdObject;
  }

  async updateObject(id, data) {
    const deletedObject = await this.maesterClient.objects.delete(id);
    this.logger.trace('Object with id: %s deleted: %j', id, deletedObject);
    const createdObject = await this.maesterClient.objects.create(JSON.stringify(data), { bucket: this.bucketId });
    this.logger.trace('Object: %j created and saved to the bucket %s', createdObject, this.bucketId);
    return createdObject;
  }
};
