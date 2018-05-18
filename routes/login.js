const express = require('express');
const db = require('./includes/mysqlConn');
const router = express.Router();

router.get('/', function (req, res) {
  resContent = {
    login : req.query.login,
    password : req.query.senha
  };
  res.send(resContent);
});

module.exports = router;