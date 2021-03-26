var http = require('http')
var fs = require('fs')
function serveStaticFile(res, path, contentType, responseCode) {
  //
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
http
  .createServer(function (req, res) {
    var path = req.url.replace(/\/?(?:\?.*)?$/, '')
    switch (path) {
      case '':
        serveStaticFile(res, 'Myself.html', 'text/html')
        break
      case '/pic/tao.jpg':
        serveStaticFile(res, 'pic/tao.jpg', 'image/jpeg')
        break
      case '/pic/dek.png':
        serveStaticFile(res, 'pic/dek.png', 'image/jpeg')
        break
      case '/1':
        serveStaticFile(res, 'Myfamily.html', 'text/html')
        break
      case '/pic/dek.png':
        serveStaticFile(res, 'pic/famall.jpg', 'image/jpeg')
        break
      case '/pic/famall.jpg':
        serveStaticFile(res, 'pic/famall.jpg', 'image/jpeg')
        break

      case '/2':
        serveStaticFile(res, 'MyGoodFriend.html', 'text/html')
        break
      case '/pic/friendall.jpg':
        serveStaticFile(res, 'pic/friendall.jpg', 'image/jpeg')
        break
      case '/pic/sport3.jpg':
        serveStaticFile(res, 'pic/sport3.jpg', 'image/jpeg')
        break
      case '/pic/activity1.jpg':
        serveStaticFile(res, 'pic/activity1.jpg', 'image/jpeg')
        break
      case '/3':
        serveStaticFile(res, './pic/friendall.jpg', 'image/jpeg')
        break

      default:
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end('I am a good Programmer')
        break
    }
  })
  .listen(3000)
console.log('Server started on localhost:3000')
