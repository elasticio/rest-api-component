"use strict";

const jsonata = require('jsonata');
const request = require('request-promise');
const messages = require('elasticio-node').messages;

exports.process = processAction;

const methodsMap = {
    DELETE: 'delete',
    GET: 'get',
    PATCH: 'patch',
    POST: 'post',
    PUT: 'put'
};

const bodyEncodings = {
    FORM_DATA: 'form-data',
    RAW: 'raw',
    URLENCODED: 'urlencoded'
};

/**
 * Executes the action's logic by sending a request to the assigned URL and emitting response to the platform.
 * The function returns a Promise sending a request and resolving the response as platform message.
 *
 * @param msg incoming messages which is empty for triggers
 * @param cfg object to retrieve triggers configuration values, such as, for example, url and userId
 * @returns promise resolving a message to be emitted to the platform
 */
function processAction(msg, cfg) {
    console.log('msg:', JSON.stringify(msg));
    console.log('cfg:', JSON.stringify(cfg));

    const config = cfg.reader;

    if (!config.url) {
        throw new Error('URL is required');
    }

    const url = jsonata(config.url).evaluate(msg.body);
    const method = config.method;
    const auth = config.auth;
    const headers = config.headers;
    const body = config.body || {};

    if (!method) {
        throw new Error('Method is required');
    }

    const formattedMethod = methodsMap[method];

    if (!formattedMethod) {
        throw new Error(
            `Method "${method}" isn't one of the: ${Object.keys(methodsMap)}.`
        );
    }

    const requestOptions = {
        uri: url
    };

    if (formattedMethod !== methodsMap.GET) {
        switch(body.encoding) {
            case bodyEncodings.FORM_DATA:
                requestOptions.form = body.formData.reduce((form, pair) => {
                    return {
                        ...form,
                        [pair.key]: jsonata(pair.value).evaluate(msg.body)
                    }
                }, {});
                break;

            case bodyEncodings.RAW:
                requestOptions.body = jsonata(body.raw).evaluate(msg.body);
                break;

            case bodyEncodings.URLENCODED:
                requestOptions.body = jsonata(body.urlencoded).evaluate(msg.body);
                requestOptions.headers = {
                    'content-type': 'application/x-www-form-urlencoded'
                };
                break;
        }
    }

    if (headers && headers.length) {
        requestOptions.headers = headers.reduce(
            (headers, header) => {
                if (!header.key || !header.value) {
                    return headers;
                }

                return {
                    ...headers,
                    [header.key.toLowerCase()]: jsonata(header.value).evaluate(msg.body)
                };
            }, { ...(requestOptions.headers || {}) })
    }

    if (auth) {
        if (!auth.basic && !auth.digest) {
            throw new Error('Auth type is required');
        }

        const authType = auth.basic ? 'basic' : 'digest';

        requestOptions.auth = {
            user: auth[authType].username,
            pass: auth[authType].password,
            sendImmediately: !auth.digest
        }

    }

    console.log('requestOptions:', JSON.stringify(requestOptions));

    return request[formattedMethod](requestOptions)
        .then(response => messages.newMessageWithBody(response));
}
