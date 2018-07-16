const express = require('express');
const request = require('../models/participationrequest');
const project = require('../models/project');
const router = express.Router();

router.get('/GetRequestsToProject', function (req, res) {
	request.getRequestsToProject(req.query.id, function(err, result) {
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

router.get('/AcceptRequest', function (req, res) {
	request.getRequest(req.query.id, function(err, result) {
		if (err) {
			console.log(err);
			res.sendStatus(500);
			return null;
		}
		if(result.length > 0) {
			var oneRequest = JSON.stringify(result);
			oneRequest = JSON.parse(oneRequest);
			oneRequest = oneRequest[0];
			project.insertUserInProject(oneRequest.requester, oneRequest.project, function(err, result) {
				if (err) {
					console.log(err);
					res.sendStatus(500);
					return;
				}
				if (result.affectedRows > 0) {
					request.acceptRequest(oneRequest.id, function(err, result) {
						if (err) {
							console.log(err);
							res.sendStatus(500);
							return;
						}
						if (result.affectedRows > 0) {
							console.log(result);
							res.send(result[0]);
						} else res.sendStatus(500);
					});
				}
			});
		} else res.sendStatus(404);
	});
});

router.get('/RefuseRequest', function (req, res) {
	request.refuseRequest(req.query.id, function(err, result) {
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

router.get('/ApplyProject', function (req, res) {
	request.applyProject(req.query.idProjectToApply, req.query.requester, req.query.message, function(err, result) {
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

router.get('/GetUserRequests', function (req, res) {
	request.getUserRequests(req.query.id, function(err, result) {
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

router.get('/DeleteRequest', function (req, res) {
	request.deleteRequest(req.query.id, function(err, result) {
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