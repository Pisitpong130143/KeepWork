var http = require('http');
http.createServer(function (req, res) {
  var path = req.url.replace(/\/?(?:\?*)$/, '')
switch (path) {
    case ' ':
      res.writeHead(200, { 'Content-Type': 'text/plain' })
      res.end('HelloWorld')
        break
    default:
      res.writeHead(200, { 'Content-Type': 'text/plain' })
      res.end(path)
      break
  }
})
  .listen(3000, '127.0.0.1')
console.log('Server started on localhost:3000;')