var fs = require('fs')
var data = fs.readFileSync('helloworld.txt',
  function (err, data) {
    console.log(data.toString())
  })
console.log('Do other things')