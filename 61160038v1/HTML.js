var express = require('express');
var app = express();
app.use(express.static('public'));
app.get('/index.html', function (req, res) {
  res.sendFile(__dirname + "/public" + "/html/" + "index2.html");
});
app.get('/process_get', function (req, res) {
  response = {
    first_name: req.query.first_name,
    last_name: req.query.last_name,
    date_birth:req.query.date_birth,
    religion:req.query.religion,
    address:req.query.address
  };
  console.log(response);
  res.end(JSON.stringify(response));
});
app.listen(8081, function () {
  console.log("Server is started already !! ");
});
