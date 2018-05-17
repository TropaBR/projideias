const express = require('express');
const util = require('util');
const db = require('./includes/mysqlConn');
const router = express.Router();

router.get('/', function (req, res) {
  util.inspect(db);
});

module.exports = router;