const express = require('express');
const user = require('../models/user');
const router = express.Router();
const bodyParser = require('body-parser');

router.post('/', bodyParser.urlencoded({extended: false}), function (req, res) {
  user.createUser(req.body, function(err, result) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    console.log(result);
    if(result.affectedRows > 0) {
      res.send(result[0]);
    } else {
      res.sendStatus(500);
    }
  });
});

module.exports = router;