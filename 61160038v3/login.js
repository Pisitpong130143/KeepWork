const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
let users = require('./users.json')
let password = require('./users.json')
let app = express()
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.engine('html', require('ejs').renderFile);



app.get('/login', function (req, res) {
  res.sendFile(__dirname + "/" + "./public/login.html")
})
app.post('/member', function (req, res, next) {
  const getEmail = req.body.email;
  const getPassword = req.body.password;
  const check = users.findIndex((val) => {
    return val.email == getEmail;
  });
  if (check == -1) {
    res.sendFile(__dirname + "/" + "./public/loginfail.html");
  } else if (check != -1 && getPassword == users[check].password && getEmail == users[check].email && users[check].member == "Yes") {
    res.render(__dirname + "/" + "./public/member.html",
      { name: users[check].name, age: users[check].age, movie: users[check].movie, email: users[check].email });
  } else if (getEmail == users[check].email && getPassword != users[check].password) {
    res.sendFile(__dirname + "/" + "./public/loginfail.html");
  } else {//ไม่เป็นสมาชิก
    res.redirect("/nonmember");
  }
});
app.get('/nonmember',function(req,res){
  res.sendFile(__dirname+ "/" + "./public/nonmember.html")
});

app.listen(3000, function () {
  console.log('Users :', users)
  console.log('Server Listen at http://localhost:3000/login')
});