const jsonata = require('@elastic.io/jsonata-moment');
const rp = require('request-promise');
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

const requestOptions = {
  method: 'get',
  uri: 'https://httpbin.org/image/png',
  followRedirect: true,
  followAllRedirects: true,
  gzip: true,
  resolveWithFullResponse: true,
  simple: false
};

rp('https://httpbin.org/image/png',requestOptions).then(result=>{console.log(result)});