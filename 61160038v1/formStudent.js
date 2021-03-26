var express = require('express');
var app = express();
app.use(express.static('public'));
app.get('/index.html', function (req, res) {
  res.sentFile(_dirname + "/" + "index.html");
});
app.get('/process_get', function (req, res) {
  response = {
    first_name: req.query.first_name,
    last_name: req.query.last_name,
    address_name: req.query.address_name,
    id: req.query.id,
  };
  console.log(response);
  res.end(JSON.stringify(response));
});
app.listen(8081, function () {
  console.log("Server is stsrt already");
});