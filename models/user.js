const db = require('../includes/mysqlConn');
const auth = require('bcrypt');

exports.createUser = function(values, callback) {
  // Criptografando a senha para gravação
  auth.hash(values.password, 11, function(err, encryptedPw){
    console.log(err);

    var sql = 'INSERT INTO User SET ?';

    // Setamos a senha para o valor da senha criptografada
    values.password = encryptedPw;

    db.query(sql, values, callback);
  });
}

exports.getUserId = function(email, callback) {
  var sql = 'SELECT id FROM User WHERE email = ?';

  db.query(sql, [email], callback);
}

exports.getUser = function(id, callback) {
  var sql = 'SELECT id, email, name, lastname, period, phone FROM User WHERE id = ?';

  db.query(sql, [id], callback);
}

exports.authPassword = function(password, encryptedPassword, callback) {
  // Comparação da senha
  auth.compare(password, encryptedPassword, callback);
}

exports.storeToken = function(token, emailToken, callback) {
  var sql = 'UPDATE User SET token = ?, emailToken = NULL WHERE emailToken = ?';

  db.query(sql, [token, emailToken], callback);
}

exports.storeEmailToken = function(token, email, callback) {
  var sql = 'UPDATE User SET emailToken = ? WHERE email = ?';

  var values = [
    token,
    email
  ]

  db.query(sql, values, callback);
}

exports.cleanTokens = function(token, field) {
  var sql = 'UPDATE User SET token = NULL, emailToken = NULL WHERE ? = ?';

  db.query(sql, field, token);
}

exports.getUserPassword = function(id, callback) {
  var sql = 'SELECT password FROM User WHERE id = ?';

  db.query(sql, [id], callback);
}

exports.getUsersByName = function(name, callback) {
	if(name) {
		var sql = "SELECT id, type, name, email, phone, lastname, period FROM User"
			+" WHERE name like '%"+name+"%'"
			+" OR lastname like '%"+name+"%'";

		db.query(sql, callback);
	}
}

exports.getUsers = function(callback) {
  var sql = 'SELECT id, name, lastname, type FROM User'
	+' ORDER BY type, name';

  db.query(sql, callback);
}