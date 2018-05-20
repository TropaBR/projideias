const express = require('express');
const user = require('../classes/user');
const router = express.Router();
const bodyParser = require('body-parser');
const auth = require('bcrypt');

// Primeiro passo da autenticação em duas etapas - CHECANDO EMAIL
router.post('/CheckEmail',
  bodyParser.urlencoded({extended: false}),
  function (req, res) {
    user.userExists(req.body.email, function(err, result) {
      if (err) {
        res.sendStatus(500);
        return;
      }
      if(result.length > 0) {
        resContent = {
          emailToken : require('crypto').randomBytes(8).toString('hex')
        };
        user.storeEmailToken(resContent.emailToken, req.body.email, function(err, result) {
          if(err) {
            console.log(err);
            res.sendStatus(500);
            return;
          }
          if(result.changedRows > 0) {
            res.send(resContent);
          }
        });
      } else res.sendStatus(404);      
    });
});

// Segundo passo da autenticação em duas etapas - CHECANDO TOKEN E SENHA
router.post('/Login',
  bodyParser.urlencoded({extended: false}),
  function (req, res) {
    console.log(req.body);
    user.authUser(req.body.emailToken, function(err, result) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      if(auth.compareSync(req.body.senha, result[0].senha)) {
        resContent = {
          token : require('crypto').randomBytes(16).toString('hex')
        };
        user.storeToken(resContent.token, req.body.emailToken, function(err, result) {
          if(err) {
            res.sendStatus(500);
            return;
          }
          if(result.changedRows > 0) {
            res.send(resContent);
          }
        });
      } else res.sendStatus(404);
    });
});

module.exports = router;