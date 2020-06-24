const MAX_DELAY_BETWEEN_CALLS = 1140; // 19 minute in seconds
function sleep(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay * 1000);
  });
}

function checkRateLimitParams(cfg, logger) {
  logger.info('Checking rate limit parameters...');
  const { delayBetweenCalls } = cfg;
  if (delayBetweenCalls) {
    const delay = parseInt(delayBetweenCalls, 10);
    logger.info('Delay Between Calls is set to:', delay);
    if (!delay || delay < 1 || delay > MAX_DELAY_BETWEEN_CALLS) {
      throw new Error(`Configuration error: Delay Between Calls value should be a positive integer and less than ${MAX_DELAY_BETWEEN_CALLS} seconds`);
    }
  }
}

async function rateLimit(cfg, logger) {
  const { delayBetweenCalls } = cfg;
  if (delayBetweenCalls) {
    const delay = parseInt(delayBetweenCalls, 10);
    logger.info('Delay Between Calls is set to:', delay);
    logger.debug('Delay is start', new Date());
    await sleep(delay);
    logger.debug('Delay is done', new Date());
  }
}
exports.sleep = sleep;
exports.rateLimit = rateLimit;
exports.checkRateLimitParams = checkRateLimitParams;
