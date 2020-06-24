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
    if (!delay || delay < 1) {
      throw new Error('Configuration error: Delay Between Calls value should be positive integer');
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
