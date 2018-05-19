const express = require('express');
const user = require('../classes/user');
const router = express.Router();

router.get('/', function (req, res) {
  resContent = {
    login : req.query.login,
    password : req.query.senha
  };
  res.send(resContent);
});

module.exports = router;