const express = require('express');
const userClass = require('../models/user');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

//// Middlewares ////

// Checagem do emailToken
function emailTokenCheck(req, res, next) {
  jwt.verify(req.body.emailToken, 'PRIVATE_KEY', function(err, decoded) {
    if(err) {
      console.log(err);
      res.sendStatus(500);
      return;
    } else {
      // Pegamos o id que estava criptografado no emailToken e usamos para pegar as informações do usuário
      // incluindo a senha para autenticação
      userClass.getUser(decoded.id, function(err, result) {
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }
        if(result.length === 0) res.sendStatus(401);
        else {
          // Caso tenhamos resultados, setamos a variavel para verificação da senha no prox middleware
          res.locals.user = result[0];
          next();
        }
      });
    }
  });  
}

// Checagem da senha
function passwordCheck(req, res, next) {
  // Checamos a senha fornecida contra a senha armazenada no banco de dados
  userClass.authPassword(req.body.password, res.locals.user.senha, function(err, bSame) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    if (bSame) {
      // Já que a senha está correta, podemos gerar o token e 
      // armazenar tanto na resposta quanto no banco de dados
      tokenData = {
        id : res.locals.user.id,
        email : res.locals.user.email,
        nome : res.locals.user.nome,
        sobrenome : res.locals.user.sobrenome
      }
      res.locals.token = jwt.sign(tokenData, 'PRIVATE_KEY');
      next();  
    } else {
      res.sendStatus(401);
    }
  });
}

// Primeiro passo da autenticação em duas etapas - CHECANDO EMAIL
router.post('/CheckEmail',
  bodyParser.urlencoded({extended: false}),
  function (req, res) {    
    userClass.getUserId(req.body.email, function(err, result) {
      if (err) {
        res.sendStatus(500);
        return;
      }
      if(result.length > 0) {
        tokenData = {
          id : result[0].id
        };
        resContent = {
          emailToken : jwt.sign(tokenData, 'PRIVATE_KEY')
        };
        res.send(resContent);
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