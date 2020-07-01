const MAX_DELAY_BETWEEN_CALLS = 1140; // 19 minute in seconds
function sleep(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

function getDelayBetweenCalls(delayBetweenCalls) {
  const delay = parseInt(delayBetweenCalls, 10);
  if (!delay || delay < 1 || delay > MAX_DELAY_BETWEEN_CALLS) {
    // TODO: Edit Error message if config fields names will be changed
    throw new Error(`Configuration error: Delay Between Calls value should be a positive integer and less than ${MAX_DELAY_BETWEEN_CALLS} seconds`);
  }
  return delay;
}

function getCallCount(callCount) {
  const callCountInt = parseInt(callCount, 10);
  if (!callCountInt || callCountInt < 1) {
    // TODO: Edit Error message if config fields names will be changed
    throw new Error('Configuration error: Call Count value should be a positive integer');
  }
  return callCountInt;
}

function getPeriod(delay, callCount) {
  const period = Math.floor((delay * 1000) / callCount);
  if (period < 1) {
    // TODO: Edit Error message if config fields names will be changed
    throw new Error('Configuration error: Period should be a positive integer');
  }
  return period;
}


function getRateLimitDelay(logger, cfg) {
  logger.info('Checking rate limit parameters...');
  const { delayBetweenCalls, callCount } = cfg;
  if (callCount && !delayBetweenCalls) {
    // TODO: Edit Error message if config fields names will be changed
    throw new Error('Call Count per Delay Between Calls should be used only in pair with Delay Between Calls option');
  }
  let rateLimitDelay = null;
  if (delayBetweenCalls) {
    const delay = getDelayBetweenCalls(delayBetweenCalls);
    logger.info('Delay Between Calls is set to:', delay);
    if (callCount) {
      const callCountInt = getCallCount(callCount);
      logger.info('Call Count is set to:', callCountInt);
      rateLimitDelay = getPeriod(delay, callCountInt);
    } else {
      rateLimitDelay = delay * 1000;
    }
    logger.info('rateLimitDelay is :', rateLimitDelay);
  }
  return rateLimitDelay;
}

async function rateLimit(logger, delay) {
  if (delay) {
    logger.info('Delay Between Calls is set to:', delay);
    logger.debug('Delay is start', new Date());
    await sleep(delay);
    logger.debug('Delay is done', new Date());
  } else {
    logger.info('Delay Between Calls is not set, process message without delay...');
  }
}

exports.sleep = sleep;
exports.rateLimit = rateLimit;
exports.getRateLimitDelay = getRateLimitDelay;
