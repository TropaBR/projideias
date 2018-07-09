const express = require('express');
const idea = require('../models/idea');
const router = express.Router();

router.get('/GetIdeas', function (req, res) {
  idea.getIdeas(req.query.filter, function(err, result) {
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