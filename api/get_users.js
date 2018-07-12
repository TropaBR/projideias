const express = require('express');
const user = require('../models/user');
const router = express.Router();

router.get('/', function (req, res) {
  user.getUsersByName(req.query.filter, function(err, result) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    if(result.length > 0) {
      res.send(JSON.stringify(result));
    } else res.sendStatus(404);
  });
});

module.exports = router;