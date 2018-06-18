const express = require('express');
const idea = require('../models/idea');
const router = express.Router();

router.get('/', function (req, res) {
	idea.createIdea(req.query, function(err, result) {
		if (err) {
			if (err.sqlState == 23000) { // Erro 23000 no banco - Entrada duplicada
				res.status(500).send("Já existe ideia com esse título.\nPor favor, mude o título e tente novamente.");
				return;
			} else {
				res.sendStatus(500);
				return;
			}
		}
		if (result.affectedRows > 0) {
			console.log(result);
			res.send(result[0]);
		} else
			res.sendStatus(500);
	});
});

module.exports = router;