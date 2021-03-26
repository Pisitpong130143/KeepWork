const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
let app = express()
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.engine('html', require('ejs').renderFile);
const mysql = require('mysql');
const { get } = require('http')

const con = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'dcoffee'
});
//path
con.connect((err) => {
  if (err) {
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/public/" + "login.html")
});
app.post('/MainMenu', function (req, res) {

  let email = req.body.email
  let password = req.body.password
  if (email == '' || password == '') {
    res.redirect('/')
  } else {
    con.query('SELECT * FROM mst_security WHERE user = ? AND password = ?', [email, password], function (err, check) {
      if (err) {
        return err;
      }
      if (check.length == 0) {
        return res.sendFile(__dirname + '/public/' + 'nonmember.html')
      }
      con.query('SELECT * FROM mst_employee WHERE id_employee = ?', [check[0].id_employee], function (err, rows) {
        console.log(rows)
        var id = rows[0].id_employee
        console.log(id)
        con.query('INSERT INTO trn_login (id_employee) VALUES(?)', [id], function (err, result) {
          if (err) return err;
        });
        res.render(__dirname + '/public/' + 'MainMenu.html', {
          name: rows[0].name,
          surname: rows[0].surname,
          id: rows[0].id_employee,
          position: rows[0].position

        });

      });
    });
  }
});

app.post('/MemberInformation', function (req, res) {
  const id = req.body.id
  console.log(id)
  con.query('SELECT * FROM mst_employee WHERE id_employee = ?', [id], function (err, rows) {
    console.log(id)
    con.query('SELECT date_format(MAX(trn_login.datetime_login),' + "'" + ' %d-%m-%Y %h:%i:%s' + "'" + ') ' + 'AS currentlogin' + ',count(trn_login.id_employee) AS amountLogin FROM trn_login WHERE id_employee = ? ORDER BY datetime_login DESC', id, function (err, info) {
      con.query('SELECT date_format(MAX(trn_logout.datetime_logout),' + "'" + ' %d-%m-%Y %h:%i:%s' + "'" + ') ' + 'AS currentlogout' + ' FROM trn_logout WHERE id_employee = ? ORDER BY datetime_logout DESC', id, function (err, info2) {
        res.render(__dirname + '/public/' + 'MemberInformation.html', {
          name: rows[0].name,
          surname: rows[0].surname,
          id: rows[0].id_employee,
          position: rows[0].position,
          salary: parseFloat(rows[0].salary).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          total: parseFloat(rows[0].total_sale).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          login: info[0].currentlogin,
          logout: info2[0].currentlogout,
          count: info[0].amountLogin
        });
      });
    });
  });
});

app.post('/UserInformationManagement', function (req, res) {
  const id = req.body.id
  console.log(id)
  con.query('SELECT * FROM mst_employee WHERE id_employee = ?', [id], function (err, rows) {
    console.log(rows[0])
    res.render(__dirname + '/public/' + 'UserInformationManagement.html', {
      position: rows[0].position,
      name: rows[0].name,
      surname: rows[0].surname,
      id: rows[0].id_employee
    })
  })
});
app.post('/insertData', function (req, res) {
  const id = req.body.id
  const name = req.body.name
  const surname = req.body.lastname
  const position = req.body.position
  const salary = req.body.salary
  const totalsell = req.body.totalsell
  const email = req.body.email
  const password = req.body.password
  console.log(id)
  con.query('INSERT INTO mst_employee (name, surname, position, salary, total_sale) VALUES(?,?,?,?,?)', [name, surname, position, parseInt(salary), parseInt(totalsell)], function (err, info1) {
    console.log(info1)
    con.query('SELECT * FROM mst_employee WHERE name = ? and surname = ?', [name, surname], function (err, info2) {
      console.log(info2)
      var idInsert = info2[0].id_employee
      con.query('INSERT INTO mst_security (user, password, id_employee) VALUES(?,?,?)', [email, password, idInsert], function (err, info3) {
        console.log(info3)
      });
    });

  });
  con.query('SELECT * FROM mst_employee WHERE id_employee = ?', [id], function (err, info2) {
    res.render(__dirname + '/public/' + 'MainMenu.html', {
      position: info2[0].position,
      name: info2[0].name,
      surname: info2[0].surname,
      id: info2[0].id_employee
    })
  })

});
app.post('/logout', function (req, res, next) {
  const id_emp = req.body.id
  con.query('INSERT INTO trn_logout (id_employee) VALUES(?)', [id_emp], function (err, info) {
    return res.redirect('/')
  });
});
app.listen(3000, function () {
  console.log('Connection established');
  console.log("Server Listen at http://127.0.0.1:3000");
});

