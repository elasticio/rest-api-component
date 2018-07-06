const rp = require('request-promise');
const http = require('http');
const client = require('elasticio-rest-node')('nick@elastic.io', 'df8b012f-7cad-4dc3-81a2-7b2087291b07');
const uuidv1 = require('uuid/v1');
const debug = require('debug')('index');
const url = require('url');
const toStream = require('string-to-stream');

const requestOptions = {
  method: 'get',
  uri: 'https://httpbin.org/image/png',
  followRedirect: true,
  followAllRedirects: true,
  gzip: true,
  resolveWithFullResponse: true,
  simple: false
};

const msg = {};
getBinaryString().then(result => addAttachment(msg, uuidv1() + '_' + new Date().getTime(), result.body, result.headers['content-length'], result.headers['content-type']));

function getBinaryString() {
  return rp('https://httpbin.org/image/png', requestOptions).then(result => {
    return result;
  })
}

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

//const jsonata = require('@elastic.io/jsonata-moment');
//const rp = require('request-promise');
//
//
// const msg = {
//   body: {url: "http://example.com", world: "world"}, attachments: {
//     "1.csv": {
//       "content-type": "text/csv",
//       "size": "45889",
//       "url": "http://insight.dev.schoolwires.com/HelpAssets/C2Assets/C2Files/C2ImportCalEventSample.csv"
//     },
//
//     "2.csv": {
//       "content-type": "text/csv",
//       "size": "45889",
//       "url": "http://insight.dev.schoolwires.com/HelpAssets/C2Assets/C2Files/C2ImportCalEventSample.csv"
//     },
//
//     "3.csv": {
//       "content-type": "text/csv",
//       "size": "45889",
//       "url": "http://insight.dev.schoolwires.com/HelpAssets/C2Assets/C2Files/C2ImportCalEventSample.csv"
//     }
//   }
// };
//
// const config = {
//   "reader": {
//     "url": "url",
//     "method": "POST",
//     "body": {
//       "formData": [{"key": "foo", "value": "\"bar\""}, {"key": "baz", "value": "\"qwe\""}, {
//         "key": "hello",
//         "value": "\"world\""
//       }], "contentType": "multipart/form-data"
//     },
//     "headers": []
//   }, "auth": {}
// };
//
// const body = config.reader.body || {};
//
// const bodyMultipartBoundary = '__X_ELASTICIO_BOUNDARY__';
//
// const attachments = Object.keys(msg.attachments).map((key, index) => {
//   return {
//     key: key,
//     value: msg.attachments[key].url,
//     filename: key,
//     "Content-Type": msg.attachments[key]["content-type"]
//   }
// });
//
// body.formData.push.apply(body.formData, attachments);
//
// var requestBody = `--${bodyMultipartBoundary}`;
//
// const processItem = item => {
//   if (item.filename) {
//     return rp(item.value).then((result) => {
//       requestBody = `${requestBody}\nContent-Disposition: form-data; name="${item.key}"; filename:"${item.filename}"\nContent-Type:${item['Content-Type']}\n\n${result}\n--${bodyMultipartBoundary}`;
//     });
//   } else {
//     return Promise.resolve().then(() => {
//       requestBody = `${requestBody}\nContent-Disposition: form-data; name="${item.key}"\n\n` + `${jsonata(item.value).evaluate(msg.body)}\n--${bodyMultipartBoundary}`
//     });
//   }
// };
//
// body.formData.reduce(
//     (p, x) => p.then(()=>{return processItem(x);}), Promise.resolve())
//     .then(() => {
//       requestBody = `${requestBody}--`;
//       console.log("\n\n\n\n\n\n", requestBody);
//     });

