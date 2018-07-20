const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

router.get('/SendEmail', function (req, res) {
	var sendTo = req.query.sendTo;
	var subjectMessage = req.query.subjectMessage;
	var message = req.query.message;
	
	var transporter = nodemailer.createTransport({
	  service: 'gmail',
	  auth: {
		user: 'projideias@gmail.com',
		pass: 'maryago1'
	  }
	});

	var mailOptions = {
	  from: 'marcos.santos@abracadabra.com.br',
	  to: sendTo,
	  subject: subjectMessage,
	  text: message
	};

	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
		console.log(error);
		res.sendStatus(500);
	  } else {
		console.log('Email sent: ' + info.response);
		res.sendStatus(200);
	  }
	});
	res.sendStatus(200); // Arrumar aqui para enviar o status de acordo com o sucesso ou falha do envio do e-mail!!!
});

module.exports = router;