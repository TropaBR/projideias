const express = require('express');
const idea = require('../models/idea');
const router = express.Router();

router.get('/GetIdea', function (req, res) {
  idea.getIdea(req.query.id, function(err, result) {
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

router.get('/GetIdeasFromProject', function (req, res) {
  idea.getIdeasFromProject(req.query.id, function(err, result) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    if(result.length > 0) {
      res.send(JSON.stringify(result));
    } else res.sendStatus(404);
  });
});

router.get('/GetFilteredIdeas', function (req, res) {
  idea.getFilteredIdeas(req.query.filter, function(err, result) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    if(result.length > 0) {
      res.send(JSON.stringify(result));
    } else res.sendStatus(404);
  });
});

router.get('/GetIdeasFromUser', function (req, res) {
  idea.getIdeasFromUser(req.query.id, function(err, result) {
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