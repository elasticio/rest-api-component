const client = require('elasticio-rest-node')();
const http = require('http');
const url = require('url');
const debug = require('debug')('attachment');
const toStream = require('string-to-stream')


exports.addAttachment = addAttachment;

function addAttachment(msg, name, body, contentLength, contentType) {
  debug("About to upload attachment body of length %s", contentLength);

  return client.resources.storage
      .createSignedUrl()
      .then(onSignedUrl);

  function onSignedUrl(result) {
    debug("Created signed URL=%s", result.get_url);

    const opts = createRequestOptions(contentLength, result.put_url);

    return uploadFile(body, opts)
        .then(result => {
          debug('attachment uploaded');
          addUrlAttachment.bind(null, msg, name, result.get_url, contentLength, contentType)
        }).catch(e => {
          debug('error %o', e);
          return Promise.reject(e)
        });
  }
}

function addUrlAttachment(msg, name, url, size, contentType) {
  msg.attachments[name] = {
    url: url,
    size: size,
    'content-type': contentType
  };
  debug('msg.attachments', msg.attachments);
  return Promise.resolve();
}


function uploadFile(body, options) {
  debug('Uploading to options=%j', options);
  options.reqBody= new Buffer(body);

  return new Promise((ok, nok) => {
    const req = http.request(options, (res) => {
      debug('Status: %d', res.statusCode);
      debug('Headers: %j', res.headers);
    });
    req.on('error', (e) => {
      debug('problem with request: %o', e.message);
      nok(e);
    });
    const stream = toStream(body);
    stream.pipe(req);
    req.end();
    stream.on('end', () => {
      debug('Streaming completed');
      req.end();
      ok();
    });
  });
}

function createRequestOptions(contentLength, putUrl) {
  const opts = url.parse(putUrl);
  opts.url = putUrl;
  opts.method = 'PUT';
  opts.headers = {
    'Content-Length': contentLength
  };
  return opts;
}