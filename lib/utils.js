"use strict";

const jsonata = require('jsonata');
const request = require('request');
const messages = require('elasticio-node').messages;
const PASSTHROUGH_BODY_PROPERTY = 'elasticio';

function handlePassthrough(message) {
    if (message.passthrough) {
        if (PASSTHROUGH_BODY_PROPERTY in message.body) {
            throw new Error(`${PASSTHROUGH_BODY_PROPERTY} property is reserved \
            if you are using passthrough functionality`);
        }

        message.body.elasticio = {};
        Object.assign(message.body.elasticio, message.passthrough);
    }
    return message;
}

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

const bodyMultipartBoundary = '__X_ELASTICIO_BOUNDARY__';

const contentTypes = {
    FORM_DATA: `multipart/form-data`,
    URLENCODED: 'application/x-www-form-urlencoded',
    TEXT: 'text/plain',
    APP_JSON: 'application/json',
    APP_XML: 'application/xml',
    TEXT_XML: 'text/xml',
    HTML: 'text/html'
};

const formattedFormDataHeader = `multipart/form-data; charset=utf8; boundary=${bodyMultipartBoundary}`;

const authTypes = {
    NO_AUTH: 'No Auth',
    BASIC: 'Basic Auth',
    API_KEY: 'API Key Auth'
};

const CREDS_HEADER_TYPE = 'CREDS_HEADER_TYPE';

module.exports.processMethod = function(isAction, msg, cfg) {
    console.log('msg:', JSON.stringify(msg));
    console.log('cfg:', JSON.stringify(cfg));

    const config = cfg.reader;

    if (!config.url) {
        throw new Error('URL is required');
    }

    if (isAction) {
        msg = handlePassthrough(msg);
    }

    const url = jsonata(config.url).evaluate(msg.body);
    const method = config.method;
    const headers = config.headers;
    const body = config.body || {};

    const auth = cfg.auth;

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
        const bodyEncoding = {
            [contentTypes.FORM_DATA]: bodyEncodings.FORM_DATA,
            [contentTypes.URLENCODED]: bodyEncodings.URLENCODED
        }[body.contentType] || bodyEncodings.RAW;

        switch(bodyEncoding) {
            case bodyEncodings.FORM_DATA:
                requestOptions.body = body.formData.reduce((result, pair) => {
                    return `${result}\nContent-Disposition: form-data; name="${pair.key}"\n\n` +
                        `${jsonata(pair.value).evaluate(msg.body)}\n--${bodyMultipartBoundary}`;
                }, `--${bodyMultipartBoundary}`) + '--';

                const existingContentTypeHeader = headers.find(header => {
                    return (
                        header.key.match(/^content-type$/i),
                        header.value === contentTypes.FORM_DATA
                    );
                });

                if (existingContentTypeHeader) {
                    existingContentTypeHeader.value = `"${formattedFormDataHeader}"`;
                } else {
                    headers.push({
                        key: 'Content-Type',
                        value: `"${formattedFormDataHeader}"`
                    });
                }

                break;

            case bodyEncodings.RAW:
                if (!body.raw) {
                    break;
                }

                requestOptions.body = jsonata(body.raw).evaluate(msg.body);

                if (typeof requestOptions.body === 'object') {
                    requestOptions.body = JSON.stringify(requestOptions.body);
                }

                break;

            case bodyEncodings.URLENCODED:
                if (!body.urlencoded.length) {
                    break;
                }

                const evaluatedUrlencoded = body.urlencoded.map(pair => ({
                    key: pair.key,
                    value: jsonata(pair.value).evaluate(msg.body)
                })).reduce((str, pair, index) => {
                    const equation = `${pair.key}=${pair.value}`;

                    return index === 0 ? equation : `${str}&${equation}`;
                }, null);

                requestOptions.body = evaluatedUrlencoded;
                break;
        }
    }

    const existingAuthHeader = (headers || []).find(header => {
        return header._type === CREDS_HEADER_TYPE;
    });

    switch(auth.type) {
        case authTypes.BASIC:
            if (existingAuthHeader) {
                existingAuthHeader.key = '';
            }

            headers.push({
                key: 'Authentication',
                value: `"Basic ${new Buffer(`${auth.basic.username}:${auth.basic.password}`).toString('base64')}"`
            });

            break;

        case authTypes.API_KEY:
            if (existingAuthHeader) {
                existingAuthHeader.key = '';
            }

            headers.push({
                key: auth.apiKey.headerName,
                value: `"${auth.apiKey.headerValue}"`
            });

            break;

        default:
            if (existingAuthHeader) {
                existingAuthHeader.key = '';
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

    console.log('requestOptions:', JSON.stringify(requestOptions));

    return new Promise((resolve, reject) => {
        request[formattedMethod](requestOptions, function(error, response, body) {
            if (error) {
                return reject(error);
            }

            let result;

            try {
                result = JSON.parse(body);
            } catch(e) {
                return reject(
                    `Cannot parse response body.` +
                    ` It should be object or array of objects in JSON format.` +
                    ` Response content-type: ${response.headers['content-type']}.` +
                    ` Response body: ${body}.`
                );
            }

            resolve(result);
        });
    }).then(response => {
        console.log('response:', JSON.stringify(response));

        return messages.newMessageWithBody(response);
    });
}
