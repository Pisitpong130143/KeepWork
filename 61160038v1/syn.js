var fs = require('fs')
var data = fs.readFileSync('helloworld.txt')

console.log(data.toString())
console.log('Do other things')