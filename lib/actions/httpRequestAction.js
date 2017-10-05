"use strict";

const processMethod = require('../utils.js').processMethod;

exports.process = processAction;

/**
 * Executes the action's logic by sending a request to the assigned URL and emitting response to the platform.
 * The function returns a Promise sending a request and resolving the response as platform message.
 *
 * @param msg incoming messages which is empty for triggers
 * @param cfg object to retrieve triggers configuration values, such as, for example, url and userId
 * @returns promise resolving a message to be emitted to the platform
 */
function processAction(msg, cfg) {
    return processMethod(true, msg, cfg);
}
