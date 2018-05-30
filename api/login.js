const express = require('express');
const userClass = require('../models/user');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('express-jwt');

//// Middlewares ////

// Checagem do emailToken
function emailTokenCheck(req, res, next) {
  userClass.getEncryptedPassword(req.body.emailToken, function(err, result) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    if(result.length === 0) res.sendStatus(401);
    else {
      // Caso tenhamos resultados, setamos a variavel para verificação da senha no prox middleware
      res.locals.encryptedPw = result[0].senha;
      next();
    }
  });
}

// Checagem da senha
function passwordCheck(req, res, next) {
  // Checamos a senha fornecida contra a senha armazenada no banco de dados
  userClass.authPassword(req.body.senha, res.locals.encryptedPw, function(err, bSame) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    if (bSame) {
      // Já que a senha está correta, podemos gerar o token e 
      // armazenar tanto na resposta quanto no banco de dados
      res.locals.token = require('crypto').randomBytes(16).toString('hex');
      userClass.storeToken(res.locals.token, req.body.emailToken, function(err, result) {
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }
        if (result.changedRows > 0) {
          next();
        } else res.sendStatus(500); 
      });
    } else {
      res.sendStatus(401);
    }
  });
}

// Primeiro passo da autenticação em duas etapas - CHECANDO EMAIL
router.post('/CheckEmail',
  bodyParser.urlencoded({extended: false}),
  function (req, res) {    
    userClass.userExists(req.body.email, function(err, result) {
      if (err) {
        res.sendStatus(500);
        return;
      }
      if(result.length > 0) {
        resContent = {
          emailToken : require('crypto').randomBytes(8).toString('hex')
        };
        userClass.storeEmailToken(resContent.emailToken, req.body.email, function(err, result) {
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
  emailTokenCheck,
  passwordCheck,
  function (req, res) {
    // Enviamos o token para o usuário utilizar
    res.send( { token : res.locals.token });
});

module.exports = router;