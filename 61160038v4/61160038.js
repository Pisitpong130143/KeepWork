const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
let app = express()
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
const mysql = require('mysql');
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sitepoint'
});
//path
app.get('/', function (req, res) {
  con.connect((err) => {
    if (err) {
      console.log('Error connecting to Db');
      return;
    }
    console.log('Connection established');
    res.send('Connection established');
  });
});

//show all
app.get('/showall', function (req, res) {
  let show = "";
  con.query('SELECT * FROM authors', (err, rows) => {
    if (err) throw err;
    rows.forEach((row) => {
      console.log(`${row.NAME} lives in ${row.city}`)
      show += row.NAME + " live in " + row.city + "<br> ";
    });
    res.send(show);
  });
})

//showId
app.get('/show/:id', function (req, res) {
  const replaceId = req.params.id
  con.query('SELECT * FROM authors Where ID = ? ', [replaceId], (err, result) => {
    if (err) throw err;
    result.forEach((row) => {
      console.log(`Changed ${row.id} row(s)`);
      console.log(row);
    })
    res.send(result)
  })
})

//addData
app.get('/add', function (req, res) {
  res.sendFile(__dirname + "/public/" + "formadd.html")
})
app.post('/process_add', function (req, res) {
  let lastID = 0
  let name = req.body.name
  let city = req.body.city
  const author = { name: name, city: city };
  con.query('INSERT INTO authors SET ?', author, (err, ress) => {
    if (err) throw err;
    lastID = ress.insertId
    console.log('Last insert ID:', lastID);
    con.query('SELECT * FROM authors Where  name = ? and city = ?', [name, city], (err, result) => {
      if (err) throw err;
      console.log("id : " + lastID, "name : " + name, "city :" + city);
      res.send(result);
    });
  });
})

//update
app.get('/edit', function (req, res) {
  res.sendFile(__dirname + "/public/" + "formedit.html")
})
app.post('/process_edit', function (req, res, next) {
  let id = req.body.id
  let name = req.body.name
  let city = req.body.city
  con.query('UPDATE authors SET name = ?, city = ? Where ID = ?', [name, city, id], (err, result) => {
    if (err) throw err;
    console.log(`Changed ${result.changedRows} row(s)`);
    res.send("ID : " + id + "<br>Name : " + name + "<br>City : " + city) 
  });
});

//delete
app.get('/delete/:id', function (req, res) {
  const removeId = req.params.id
  con.query('DELETE FROM authors WHERE id = ?', [removeId], (err, result) => {
    if (err) throw err;
    console.log(`Deleted ${result.affectedRows} row(s)`);
  });
  con.query('SELECT * FROM authors', (err, rows) => {
    if (err) throw err;
    rows.forEach((row) => {
      console.log(`The rest ID : ${row.id} Name ${row.NAME} lives in ${row.city}`);
    });
    res.send(rows);
  });
})


app.listen(3000, function () {
  console.log("Server Listen at http://localhost:3000");
  console.log("Server Listen at http://localhost:3000/showall");
  console.log("Server Listen at http://localhost:3000/show/");
  console.log("Server Listen at http://localhost:3000/add");
  console.log("Server Listen at http://localhost:3000/edit");
  console.log("Server Listen at http://localhost:3000/delete/");
});