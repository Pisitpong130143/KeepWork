var http = require('http');
http.createServer(function (req, res) {
  var path = req.url.replace(/\/?(?:\?.*)?$/, '');
  switch (path) {
    case '':
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Welcome to Buu page');
      break;
    case '/about':
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Name:Pisitpong Narttammakul Branch:Computer Science Student Id:61160038 Programmer');
      break;
    case '/pic/tao.jpg':
      serveStaticFile(res, 'pic/tao.jpg', 'image/jpeg')
      break
    case '/2':
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Student Name + Address');
      break;
    case '/3':
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Student Name + Address + a good friend name');
      break;
    default:
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('I am a good Programmer');
      break;
  }
}).listen(8081, '127.0.0.1');
console.log('Server started on localhost:8081;');