const db = require('../includes/mysqlConn');
const auth = require('bcrypt');

exports.createUser = function(values, callback) {
  // Criptografando a senha para gravação
  auth.hash(values.senha, 11, function(err, encryptedPw){
    var sql = 'INSERT INTO Usuario SET ?';

    // Setamos a senha para o valor da senha criptografada
    values.senha = encryptedPw;

    db.query(sql, values, callback);
  });
}

exports.userExists = function(email, callback) {
  var sql = 'SELECT \'Found\' FROM Usuario WHERE email = ?';

  db.query(sql, [email], callback);
}

exports.getEncryptedPassword = function(emailToken, callback) {
  var sql = 'SELECT senha FROM Usuario WHERE emailToken = ?';

  db.query(sql, [emailToken], callback);
}

exports.authPassword = function(password, encryptedPassword, callback) {
  // Comparação da senha
  auth.compare(password, encryptedPassword, callback);
}

exports.storeToken = function(token, emailToken, callback) {
  var sql = 'UPDATE Usuario SET token = ?, emailToken = NULL WHERE emailToken = ?';

  db.query(sql, [token, emailToken], callback);
}

exports.storeEmailToken = function(token, email, callback) {
  var sql = 'UPDATE Usuario SET emailToken = ? WHERE email = ?';

  var values = [
    token,
    email
  ]

  db.query(sql, values, callback);
}

exports.cleanTokens = function(token, field) {
  var sql = 'UPDATE Usuario SET token = NULL, emailToken = NULL WHERE ? = ?';

  db.query(sql, field, token);
}