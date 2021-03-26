var express = require('express');
var app = express();
app.get("/", function (req, res) {
  console.log("Got a GET request for the homepage");
  res.send("Hello World");
})
var server = app.listen(8081, function () {
  var port = server.address().port
  console.log("The port number of Server : ", port)
})