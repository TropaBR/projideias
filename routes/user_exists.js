const express = require('express');
const user = require('../classes/user');
const router = express.Router();

router.get('/', function (req, res) {
  user.userExists(req.query.email, function(err, result) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    if(result.length > 0) res.sendStatus(200);
    else res.sendStatus(404);
  });
});

module.exports = router;