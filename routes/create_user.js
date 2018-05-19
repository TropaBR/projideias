const express = require('express');
const user = require('../classes/user');
const router = express.Router();
const bodyParser = require('body-parser');

router.post('/', bodyParser.urlencoded({extended: false}), function (req, res) {
  user.createUser(req.body, function(err, result) {
    if (err) {
      res.send('Erro');
      return;
    }
    if(result.affectedRows > 0) res.send(result);
    else res.sendStatus(500);
  });
});

module.exports = router;