const express = require('express');
const user = require('../models/user');
const router = express.Router();
const bodyParser = require('body-parser');
var sessions = require("client-sessions");

router.post('/', bodyParser.urlencoded({extended: false}), function (req, res) {
  user.createUser(req.body, function(err, result) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    if(result.affectedRows > 0) {
      console.log(result);
      res.send(result[0]);
    } else res.sendStatus(500);
  });
});

module.exports = router;