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

router.get('/GetProjectsWithUser', function (req, res) {
  project.getProjectsWithUser(req.query.id, function(err, result) {
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

/*
router.get('/GetParticipantRoles', function (req, res) {
    project.getParticipantRoles(function(err, result) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    if(result.length > 0) {
	  result = JSON.stringify(result);
	  result = JSON.parse(result);
	  result = result[0].Type;
	  result = result.substring(5,result.length-1);
	  result = result.split(',');
	  var obj = [];
	  for ( var i = 0; i < result.length; i++ ) {
		obj.push( '{"name":"'+ result[i].substring(1,result[i].length-1) +'"}' ); // Para transformar em string JSON
	  }
	  obj = '[' + obj.join(',') + ']';
      res.send(obj);
    } else {
      res.sendStatus(404);
    }
  });
});
*/

router.get('/GetProjectStatusHistory', function (req, res) {
  project.getProjectStatusHistory(req.query.id, function(err, result) {
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

router.get('/GetTypesOfProjectStatus', function (req, res) {
  project.getTypesOfProjectStatus(function(err, result) {
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

router.get('/UpdateProject', function (req, res) {
	project.updateProject(req.query.idProjectToUpdate, req.query.selectStatus, req.query.updateProjectComment, function(err, result) {
    if (err) {
	    console.log(err);
      res.sendStatus(500);
      return;
    }
    if (result.affectedRows > 0) {
      console.log(result);
      res.send(result[0]);
    } else
		res.sendStatus(500);
  });
});

module.exports = router;