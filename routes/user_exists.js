const express = require('express');
const db = require('./includes/mysqlConn');
const router = express.Router();

router.get('/', function (req, res) {
  // SQL
  var sql = 'SELECT \'Found\' FROM Usuario WHERE email = ?';

  // Inputs
  var values = [
    req.query.email
  ];

  // Logica
  db.query(sql, values, function (err, result) {
    if(err) {
      res.send('Erro');
      return;
    }
    if(result.length > 0) res.sendStatus(200);
    else res.sendStatus(404);
  });
});

module.exports = router;