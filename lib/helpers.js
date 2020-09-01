const { URL } = require('url');
const path = require('path');
const request = require('request-promise');

const MAX_DELAY_BETWEEN_CALLS = 1140 * 1000; // 1140 = 19 minutes in seconds
function sleep(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

function getDelay(delay) {
  const delayInt = parseInt(delay, 10);
  if (!delayInt || delayInt < 1) {
    // TODO: Edit Error message if config fields names will be changed
    throw new Error('Configuration error: Delay value should be a positive integer');
  }
  return delayInt;
}

function getCallCount(callCount) {
  const callCountInt = parseInt(callCount, 10);
  if (!callCountInt || callCountInt < 1) {
    // TODO: Edit Error message if config fields names will be changed
    throw new Error('Configuration error: Call Count value should be a positive integer');
  }
  return callCountInt;
}

function getDelayBetweenCalls(delay, callCount) {
  const delayBetweenCalls = (delay * 1000) / callCount;
  if (delayBetweenCalls < 0) {
    // TODO: Edit Error message if config fields names will be changed
    throw new Error('Configuration error: Delay Between Calls should be positive value');
  }
  if (delayBetweenCalls > MAX_DELAY_BETWEEN_CALLS) {
    // TODO: Edit Error message if config fields names will be changed
    throw new Error(`Configuration error: Delay Between Calls should be less than ${MAX_DELAY_BETWEEN_CALLS} milliseconds`);
  }
  return delayBetweenCalls;
}

function getRateLimitDelay(logger, cfg) {
  logger.info('Checking rate limit parameters...');
  const { delay, callCount } = cfg;
  if (callCount && !delay) {
    // TODO: Edit Error message if config fields names will be changed
    throw new Error('Call Count value should be used only in pair with Delay option');
  }
  let rateLimitDelay = null;
  if (delay) {
    const delayInt = getDelay(delay);
    logger.debug('Delay is set to:', delay);
    if (callCount) {
      const callCountInt = getCallCount(callCount);
      logger.debug('Call Count is set to:', callCountInt);
      rateLimitDelay = getDelayBetweenCalls(delayInt, callCountInt);
    } else {
      rateLimitDelay = delay * 1000;
    }
    logger.debug('rateLimitDelay is:', rateLimitDelay);
  }
  return rateLimitDelay;
}

async function rateLimit(logger, delay) {
  if (delay) {
    logger.info(`Delay Between Calls is set to: ${delay} ms`);
    logger.debug('Delay is start', new Date());
    await sleep(delay);
    logger.debug('Delay is done', new Date());
  } else {
    logger.info('Delay Between Calls is not set, process message without delay...');
  }
}

async function getSecret(emitter, secretId) {
  const parsedUrl = new URL(process.env.ELASTICIO_API_URI);
  parsedUrl.username = process.env.ELASTICIO_API_USERNAME;
  parsedUrl.password = process.env.ELASTICIO_API_KEY;

  parsedUrl.pathname = path.join(
    parsedUrl.pathname || '/',
    'v2/workspaces/',
    process.env.ELASTICIO_WORKSPACE_ID,
    'secrets',
    String(secretId),
  );

  const secretUri = parsedUrl.toString();
  emitter.logger.info('going to fetch secret', secretUri);
  const secret = await request(secretUri);
  const parsedSecret = JSON.parse(secret).data.attributes;
  emitter.logger.trace('got secret', parsedSecret);
  return parsedSecret;
}

async function refreshToken(emitter, secretId) {
  const parsedUrl = new URL(process.env.ELASTICIO_API_URI);
  parsedUrl.username = process.env.ELASTICIO_API_USERNAME;
  parsedUrl.password = process.env.ELASTICIO_API_KEY;
  parsedUrl.pathname = path.join(
    parsedUrl.pathname,
    'v2/workspaces/',
    process.env.ELASTICIO_WORKSPACE_ID,
    'secrets',
    secretId,
    'refresh',
  );

  const secretUri = parsedUrl.toString();
  emitter.logger.info('going to refresh secret', secretUri);
  const secret = await request({
    uri: secretUri,
    json: true,
    method: 'POST',
  });
  const token = secret.data.attributes.credentials.access_token;
  emitter.logger.info('got refreshed secret token', token);
  return token;
}

exports.sleep = sleep;
exports.rateLimit = rateLimit;
exports.getRateLimitDelay = getRateLimitDelay;
exports.getSecret = getSecret;
exports.refreshToken = refreshToken;
