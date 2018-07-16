const express = require('express');
const invite = require('../models/invite');
const project = require('../models/project');
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

router.get('/CreateInvite', function (req, res) {
	var sender = req.query.sender;
	var guest = req.query.selectUser;
	var idProject = req.query.idProjectToInvite;
	var comment = req.query.inviteUserComment;
	/*
	var participants = project.verifyUserAlreadyInProject(idProject, guest, function(err, result) {
		if (err) {
		  console.log(err);
		  res.sendStatus(500);
		  return;
		}
		if(result.length > 0) {
          return JSON.stringify(result);
        } else return null;
	});
	if(participants != null) {
		console.log(err);
	    res.sendStatus(500);
	    return;
	}    
	*/
	invite.createInvite(sender, guest, idProject, comment, function(err, result) {
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

router.get('/DeleteInvite', function (req, res) {
	invite.deleteInvite(req.query.id, function(err, result) {
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

router.get('/GetUserInvitations', function (req, res) {
	invite.getUserInvitations(req.query.id, function(err, result) {
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

router.get('/RefuseInvite', function (req, res) {
	invite.refuseInvite(req.query.id, function(err, result) {
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

router.get('/AcceptInvite', function (req, res) {
	invite.getInvite(req.query.id, function(err, result) {
		if (err) {
			console.log(err);
			res.sendStatus(500);
			return null;
		}
		if(result.length > 0) {
			var oneInvite = JSON.stringify(result);
			oneInvite = JSON.parse(oneInvite);
			oneInvite = oneInvite[0];
			project.insertUserInProject(oneInvite.guest, oneInvite.project, function(err, result) {
				if (err) {
					console.log(err);
					res.sendStatus(500);
					return;
				}
				if (result.affectedRows > 0) {
					invite.acceptInvite(oneInvite.id, function(err, result) {
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

module.exports = router;