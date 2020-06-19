/* eslint-disable max-len */
const MaesterClient = require('../helpers/maesterClient');

function calculateNextResetTime(windowMs) {
  const d = new Date();
  d.setMilliseconds(d.getMilliseconds() + windowMs);
  return d;
}

function isNextResetTimeCome(nextResetTime) {
  const nextDate = new Date(nextResetTime);
  const currentDate = new Date();
  return currentDate > nextDate;
}

async function rateLimit(context, options) {
  const maesterClient = new MaesterClient(context);
  const object = await maesterClient.getObjectFromBucket(options.externalId);
  const windowMs = options.windowMs || 60 * 1000;
  if (!object) {
    const nextResetTime = calculateNextResetTime(windowMs);
    const createdObject = await maesterClient.createObject({ nextResetTime, hits: 1 });
    context.logger.info('createdObject: ', createdObject);
    return;
  }
  const { nextResetTime, hits, id } = object;
  const maxHits = options.max || 5;
  if (isNextResetTimeCome(nextResetTime)) {
    const newNextResetTime = calculateNextResetTime(windowMs);
    const updatedObject = await maesterClient.updateObject(id, { nextResetTime: newNextResetTime, hits: 1 });
    context.logger.info('createdObject: ', updatedObject);
    return;
  }
  const currentHits = hits + 1;
  if (currentHits <= maxHits) {
    const updatedObject = await maesterClient.updateObject(id, { nextResetTime, hits: currentHits });
    context.logger.info('createdObject: ', updatedObject);
    return;
  }
  throw new Error('To many requests');
}
module.exports = { rateLimit, isNextResetTimeCome, calculateNextResetTime };
