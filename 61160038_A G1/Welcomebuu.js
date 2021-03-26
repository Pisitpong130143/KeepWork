var http = require('http')
var fs = require('fs')
function serveStaticFile(res, path, contentType, responseCode) {
  if (!responseCode) responseCode = 200
  fs.readFile(path, function (err, data) {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' })
      res.end('500 - Internal Error')
    } else {
      res.writeHead(responseCode, { 'Content-Type': 'contentType' })
      res.end(data)
    }
  })
}
var http = require('http');
http.createServer(function (req, res) {
  var path = req.url.replace(/\/?(?:\?.*)?$/, '');
  switch (path) {
    case '':
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Welcome to Buu page');
      break;
    case '/about':
      serveStaticFile(res, '../61160038_A G1/public/student.html', 'text/html')
      break;
    case '/img':
      serveStaticFile(res, '../61160038_A G1/public/imgs/img.png', 'image/jpeg')
      break;
    case '/login':
      serveStaticFile(res, '../61160038_A G1/public/login.html', 'text/html')
      break;
    case '/syn':
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('-');
      var fs = require('fs')
      var data = fs.readFileSync('information.txt')

      console.log(data.toString())
      console.log('****Synchronous****')
      break;
    case '/asyn':
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('-');
      var fs = require('fs')
      var data = fs.readFile('information.txt',
        function (err, data) {
          console.log(data.toString())
        }
      )
      console.log('****Asynchronous****')
      break;
    default:
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Out of condition');
      break;
  }
}).listen(8081, '127.0.0.1');
console.log('Server started on 127.0.0.1:8081;');