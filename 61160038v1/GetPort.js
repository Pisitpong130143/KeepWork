var express = require('express');
var app = express();
app.get("/", function (req, res) {
  console.log("Got a GET request for the homepage");
  res.send("Pisitpong Narttammakul");
})
app.get("/1", function (req, res) {
  console.log("Got a GET request for the homepage");
  res.send("369 Road:Wachirapacarn Mung:Chonburi Country:Thailand Zip:20000");
})
app.get("/2", function (req, res) {
  console.log("Got a GET request for the homepage");
  res.send("Pisitpong Narttammakul + 369 Road:Wachirapacarn Mung:Chonburi Country:Thailand Zip:20000");
})
app.get("/3", function (req, res) {
  console.log("Got a GET request for the homepage");
  res.send("Pisitpong Narttammakul + 369 Road:Wachirapacarn Mung:Chonburi Country:Thailand Zip:20000 + HybridGroup");
})
var server = app.listen(8081, function () {
  var port = server.address().port
  console.log("The port number of Server localhost:8081 : ", port)
})