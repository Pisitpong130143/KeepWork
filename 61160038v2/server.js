const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
let users = require('./users.json')
let app = express()
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/user/all/', function (req, res, next) {
  return res.status(200).json({
    code: 1,
    message: 'OK',
    data: users,
  })
})

app.get('/user/show/:id', function (req, res) {
  const replaceId = req.params.id;
  const position = users.findIndex((val) => {
    return val.id == replaceId;
  })

  return res.status(200).json({
    code: 1,
    message: 'OK',
    data: users[position]
  })
})

app.get('/user/del/:id', function(req, res, next) {
  const removeId = req.params.id
  const position = users.findIndex((val) => { 
      return val.id == removeId
  })
  users.splice(position, 1)
  return res.status(200).json({
      code: 1,
      message: 'OK',
      data: users
  })
})

app.get('/user/add/', function (req, res) {
  res.sendFile(__dirname + "/" + "webform.html")
}) 
app.get('/process_get', function (req, res, next) {
  let user = {}
  user.id = users.length + 1
  user.name = req.query.name
  user.age = Number(req.query.age)
user.movie = req.query.movie;
  users.push(user)
  return res.status(201).json({
    code: 1,
    message: 'OK',
    data: users
  })
})

app.get('/user/edit/', function (req, res) {
  res.sendFile(__dirname + "/" + "editform.html")
})
app.get('/edit/process_post', function (req, res, next) {
  const replaceId = req.query.id;
  const position = users.findIndex(function (val) { 
    return val.id == replaceId;
  });
  console.log(users[position]);
  users[position].name = req.query.name; 
  users[position].age = Number(req.query.age);
  users[position].movie = req.query.movie;
  return res.status(200).json({
    code: 1,
    message: 'OK',
    data: users
  });

})
app.listen(3000, function () {
  console.log('Server Listen at http://localhost:3000')
  console.log('Users :', users)
})