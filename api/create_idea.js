const express = require('express');
const idea = require('../models/idea');
const router = express.Router();

router.get('/', function (req, res) {
	idea.createIdea(req.query, function(err, result) {
		if (err) {
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