const express = require('express');
const invite = require('../models/invite');
const router = express.Router();

router.get('/GetInvitationsFromProject', function (req, res) {
	invite.getInvitationsFromProject(req.query.id, function(err, result) {
    if (err) {
	  console.log(err);
      res.sendStatus(500);
      return;
    }
    if(result.length > 0) {
      res.send(JSON.stringify(result));
    } else res.sendStatus(404);
  });
});

module.exports = router;