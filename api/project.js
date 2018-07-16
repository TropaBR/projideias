const express = require('express');
const project = require('../models/project');
const bodyParser = require('body-parser');
const router = express.Router();

router.get('/GetProject', function (req, res) {
  project.getProject(req.query.id, function(err, result) {
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

router.get('/GetProjects', function (req, res) {
  project.getProjects(req.query.filter, req.query.selectStatus, function(err, result) {
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

router.get('/GetProjectStatus', function (req, res) {
  project.getProjectStatus(function(err, result) {
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

router.get('/GetProjectParticipants', function (req, res) {
  project.getParticipants(req.query.id, function(err, result) {
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

router.get('/GetProjectsUsingIdea', function (req, res) {
  project.getProjectsUsingIdea(req.query.id, function(err, result) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    if(result.length > 0) {
      res.send(JSON.stringify(result));
    } else res.sendStatus(404);
  });
});

router.get('/GetProjectLeader', function (req, res) {
  project.getProjectLeader(req.query.id, function(err, result) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    if(result.length > 0) {
      res.send(JSON.stringify(result));
    } else res.sendStatus(404);
  });
});

router.get('/GetProjectWithUser', function (req, res) {
  project.getProjectWithUser(req.query.id, function(err, result) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    if(result.length > 0) {
      res.send(JSON.stringify(result));
    } else res.sendStatus(404);
  });
});

router.get('/GetProjectTypes', function (req, res) {
  project.getProjectTypes(function(err, result) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    if(result.length > 0) {
      res.send(JSON.stringify(result));
    } else res.sendStatus(404);
  });
});

router.post('/CreateProject', bodyParser.urlencoded({extended: false}), function (req, res) {

  project.createProject(req.body, res.locals.user.id, function(err, result) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    console.log(result);
    if(result.affectedRows > 0) {
      result = { id: result.insertId };
      res.send(JSON.stringify(result));
    } else res.sendStatus(404);
  });
});

module.exports = router;