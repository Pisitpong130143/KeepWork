var fs = require('fs')
var data = fs.readFile('information.txt',
  function (err, data) {
    console.log(data.toString())
  })
console.log('****Asynchronous****')