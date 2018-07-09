const express = require('express');
const user = require('../models/user');
const bodyParser = require('body-parser');
const router = express.Router();

router.get('/UserExists', function (req, res) {
  user.getUserId(req.query.email, function(err, result) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    if(result.length > 0) res.sendStatus(200);
    else res.sendStatus(404);
  });
});

router.get('/GetUser', function (req, res) {
    user.getUser(req.query.id, function(err, result) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    if(result.length > 0) {
      res.send(JSON.stringify(result));
    } else {
      res.sendStatus(404);
    }
  });
});

router.post('/CreateUser', bodyParser.urlencoded({extended: false}), function (req, res) {
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