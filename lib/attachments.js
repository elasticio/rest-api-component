const client = require('elasticio-rest-node')();
const url = require('url');
const debug = require('debug')('attachment');
const http = require('http');


exports.addAttachment = addAttachment;

function addAttachment(msg, name, body, contentLength, contentType) {
  return getUrls().then(result => {
    debug('createSignedUrl result: %j', result);
    debug('Uploading to url: %s', result.put_url);
    return uploadFile(result.put_url, contentLength, contentType);
  });


  function getUrls() {
    return client.resources.storage.createSignedUrl();
  }

  function uploadFile(put_url, contentLength, contentType) {
    let options = createRequestOptions(put_url, contentLength);
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
      stream.on('end', () => {
        debug('Streaming completed');
        req.end();
        ok();
      });
      if (!msg.attachments) {
        msg.attachments = {};
      }
      msg.attachments[name] = {
        url: put_url,
        size: contentLength,
        'content-type': contentType
      };
    });
  }

  function createRequestOptions(putUrl, contentLength) {
    const opts = url.parse(putUrl);
    opts.method = 'PUT';
    opts.headers = {
      'Content-Length': contentLength
    };
    return opts;
  }
}