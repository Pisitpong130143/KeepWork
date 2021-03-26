var fs = require('fs')
var data = fs.readFileSync('information.txt')

console.log(data.toString())
console.log('****Synchronous****')