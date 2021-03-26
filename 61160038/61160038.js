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
app.engine('html', require('ejs').renderFile)
const mysql = require('mysql')
// const { get } = require('http')
// const { parse } = require('node:path')

const con = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'dcoffee'
})
//path
con.connect(err => {
  if (err) {
    console.log('Error connecting to Db')
    return
  }
  console.log('Connection established')
})

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/' + 'login.html')
})

app.post('/MainMenu', function (req, res) {
  const id = req.body.id
  console.log(id)
  let email = req.body.email
  let password = req.body.password
  if (email == '' || password == '') {
    res.redirect('/')
  } else if (id != '' && id != null) {
    console.log('testtt1')
    con.query(
      'SELECT * FROM mst_employee WHERE id_employee = ?',
      [id],
      function (err, rows) {
        console.log(rows)
        console.log(id)
        res.render(__dirname + '/public/' + 'MainMenu.html', {
          name: rows[0].name,
          surname: rows[0].surname,
          id: rows[0].id_employee,
          position: rows[0].position
        })
      }
    )
  } else {
    con.query(
      'SELECT * FROM mst_security WHERE user = ? AND password = ?',
      [email, password],
      function (err, check) {
        if (err) {
          return err
        }
        if (check.length == 0) {
          return res.sendFile(__dirname + '/public/' + 'nonmember.html')
        }
        con.query(
          'SELECT * FROM mst_employee WHERE id_employee = ?',
          [check[0].id_employee],
          function (err, rows) {
            console.log(rows)
            var id = rows[0].id_employee
            console.log(id)
            con.query(
              'INSERT INTO trn_login (id_employee) VALUES(?)',
              [id],
              function (err, result) {
                if (err) return err
              }
            )
            res.render(__dirname + '/public/' + 'MainMenu.html', {
              name: rows[0].name,
              surname: rows[0].surname,
              id: rows[0].id_employee,
              position: rows[0].position
            })
          }
        )
      }
    )
  }
})

app.post('/MemberInformation', function (req, res) {
  const id = req.body.id
  console.log(id)
  con.query('SELECT * FROM mst_employee WHERE id_employee = ?', [id], function (
    err,
    rows
  ) {
    console.log(id)
    con.query(
      'SELECT date_format(MAX(trn_login.datetime_login),' +
        "'" +
        ' %d-%m-%Y %h:%i:%s' +
        "'" +
        ') ' +
        'AS currentlogin' +
        ',count(trn_login.id_employee) AS amountLogin FROM trn_login WHERE id_employee = ? ORDER BY datetime_login DESC',
      id,
      function (err, info) {
        con.query(
          'SELECT date_format(MAX(trn_logout.datetime_logout),' +
            "'" +
            ' %d-%m-%Y %h:%i:%s' +
            "'" +
            ') ' +
            'AS currentlogout' +
            ' FROM trn_logout WHERE id_employee = ? ORDER BY datetime_logout DESC',
          id,
          function (err, info2) {
            res.render(__dirname + '/public/' + 'MemberInformation.html', {
              name: rows[0].name,
              surname: rows[0].surname,
              id: rows[0].id_employee,
              position: rows[0].position,
              salary: parseFloat(rows[0].salary)
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
              total: parseFloat(rows[0].total_sale)
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
              login: info[0].currentlogin,
              logout: info2[0].currentlogout,
              count: info[0].amountLogin
            })
          }
        )
      }
    )
  })
})

app.post('/UserInformationAdding', function (req, res) {
  const id = req.body.id
  console.log(id)
  con.query('SELECT * FROM mst_employee WHERE id_employee = ?', [id], function (
    err,
    rows
  ) {
    res.render(__dirname + '/public/' + 'UserInformationAdding.html', {
      position: rows[0].position,
      name: rows[0].name,
      surname: rows[0].surname,
      id: rows[0].id_employee
    })
  })
})

app.post('/UserInformationManagement', function (req, res) {
  const id = req.body.id
  console.log(id)
  con.query('SELECT * FROM mst_employee WHERE id_employee = ?', [id], function (
    err,
    rows
  ) {
    con.query('SELECT * FROM mst_employee ', function (err, row) {
      res.render(__dirname + '/public/' + 'UserInformationManagement.html', {
        position: rows[0].position,
        name: rows[0].name,
        surname: rows[0].surname,
        id: rows[0].id_employee,
        data: row
      })
    })
  })
})
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
  con.query(
    'INSERT INTO mst_employee (name, surname, position, salary, total_sale) VALUES(?,?,?,?,?)',
    [name, surname, position, parseInt(salary), parseInt(totalsell)],
    function (err, info1) {
      console.log(info1)
      con.query(
        'SELECT * FROM mst_employee WHERE name = ? and surname = ?',
        [name, surname],
        function (err, info2) {
          console.log(info2)
          var idInsert = info2[0].id_employee
          con.query(
            'INSERT INTO mst_security (user, password, id_employee) VALUES(?,?,?)',
            [email, password, idInsert],
            function (err, info3) {
              console.log(info3)
            }
          )
        }
      )
    }
  )
  con.query('SELECT * FROM mst_employee WHERE id_employee = ?', [id], function (
    err,
    info2
  ) {
    res.render(__dirname + '/public/' + 'MainMenu.html', {
      position: info2[0].position,
      name: info2[0].name,
      surname: info2[0].surname,
      id: info2[0].id_employee
    })
  })
})

app.post('/UserInformationEditing', function (req, res) {
  const id = req.body.id
  const idEmp = req.body.idEmp
  console.log(id)
  console.log(idEmp)
  con.query('SELECT * FROM mst_employee WHERE id_employee = ?', [id], function (
    err,
    rows
  ) {
    console.log(id)
    con.query(
      'SELECT mst_employee.* , mst_security.user , mst_security.password FROM `mst_security`,mst_employee WHERE mst_security.id_employee = ? AND mst_employee.id_employee = ?',
      [idEmp, idEmp],
      function (err, info2) {
        console.log(info2[0].salary)
        res.render(__dirname + '/public/' + 'UserInformationEditing.html', {
          name: rows[0].name,
          surname: rows[0].surname,
          id: rows[0].id_employee,
          position: rows[0].position,
          salary: parseFloat(info2[0].salary).toFixed(2),
          total: parseFloat(info2[0].total_sale).toFixed(2),
          userform: info2[0].user,
          passwordform: info2[0].password,
          nameform: info2[0].name,
          surnameform: info2[0].surname,
          idform: info2[0].id_employee,
          positionform: info2[0].position,
          idEdit: idEmp
        })
      }
    )
  })
})

app.post('/edit', function (req, res) {
  const id = req.body.id
  const idEmp = req.body.idEdit
  const name = req.body.name
  const surname = req.body.lastname
  const position = req.body.position
  const salary = req.body.salary
  console.log(idEmp)
  const totalsell = req.body.totalsell
  const email = req.body.email
  const password = req.body.password
  var record = [
    name,
    surname,
    position,
    salary,
    totalsell,
    email,
    password,
    idEmp,
    idEmp
  ]
  console.log(id)
  con.query('SELECT * FROM mst_employee WHERE id_employee = ?', [id], function (
    err,
    rows
  ) {
    con.query(
      'UPDATE mst_employee, mst_security SET mst_employee.name = ?, mst_employee.surname = ?, mst_employee.position = ?,mst_employee.salary = ?,mst_employee.total_sale = ?,mst_security.user = ?,mst_security.password = ? WHERE mst_security.id_employee = ? AND mst_employee.id_employee = ? ',
      record,
      function (err, result) {
        console.log(result)
        res.render(__dirname + '/public/' + 'MainMenu.html', {
          position: rows[0].position,
          name: rows[0].name,
          surname: rows[0].surname,
          id: rows[0].id_employee
        })
      }
    )
  })
})
app.post('/deleteForm', function (req, res, next) {
  const id = req.body.id
  console.log(id)
  const idEmp = req.body.idDel
  con.query('SELECT * FROM mst_employee WHERE id_employee = ?', [id], function (
    err,
    row
  ) {
    console.log(row)
    con.query(
      'SELECT * FROM mst_employee WHERE id_employee = ?',
      [idEmp],
      function (err, info) {
        res.render(__dirname + '/public/' + 'UserInformationDeleting.html', {
          position: row[0].position,
          name: row[0].name,
          surname: row[0].surname,
          id: id,
          nameform: info[0].name,
          surnameform: info[0].surname,
          positionform: info[0].position,
          idDel: idEmp
        })
      }
    )
  })
})
app.post('/delete', function (req, res, next) {
  const id = req.body.id
  console.log(id)
  const idEmp = req.body.idDel
  console.log(idEmp)
  con.query(
    'SELECT * FROM mst_employee WHERE mst_employee.id_employee = ?',
    [id],
    function (err, rows) {
      console.log(rows)
      con.query(
        'DELETE FROM mst_employee WHERE id_employee = ?',
        [idEmp],
        function (err, result1) {
          console.log(result1)
        }
      )
      con.query(
        'DELETE FROM mst_security WHERE id_employee = ?',
        [idEmp],
        function (err, result2) {
          console.log(result2)
        }
      )
      con.query(
        'DELETE FROM trn_login WHERE id_employee = ?',
        [idEmp],
        function (err, result3) {
          console.log(result3)
        }
      )
      con.query(
        'DELETE FROM trn_logout WHERE id_employee = ? ',
        [idEmp],
        function (err, result4) {
          console.log(result4)
        }
      )
      res.render(__dirname + '/public/' + 'MainMenu.html', {
        position: rows[0].position,
        name: rows[0].name,
        surname: rows[0].surname,
        id: rows[0].id_employee
      })
    }
  )
})
app.post('/search', function (req, res) {
  const id = req.body.id
  const find = req.body.find
  console.log(find)
  con.query('SELECT * FROM mst_employee WHERE id_employee = ?', [id], function (
    err,
    info2
  ) {
    con.query(
      'SELECT * FROM mst_employee WHERE name like ' +
        "'%" +
        find +
        "%'" +
        'OR position like' +
        "'%" +
        find +
        "%'" +
        'OR surname like ' +
        "'%" +
        find +
        "%'",
      function (err, row) {
        res.render(__dirname + '/public/' + 'UserInformationManagement.html', {
          position: info2[0].position,
          name: info2[0].name,
          surname: info2[0].surname,
          id: info2[0].id_employee,
          data: row
        })
      }
    )
  })
})

app.post('/logout', function (req, res, next) {
  const id_emp = req.body.id
  con.query(
    'INSERT INTO trn_logout (id_employee) VALUES(?)',
    [id_emp],
    function (err, info) {
      return res.redirect('/')
    }
  )
})
app.listen(3000, function () {
  console.log('Connection established')
  console.log('Server Listen at http://127.0.0.1:3000')
})
