const db = require('../includes/mysqlConn');
const auth = require('bcrypt');

class User {
  constructor() {

  }

  static createUser(values, callback) {
    // Password encryption
    values.senha = auth.hashSync(values.senha, 11);

    // SQL
    var sql = 'INSERT INTO Usuario SET ?';

    db.query(sql, values, callback);
  }

  static userExists(email, callback) {
    // SQL
    var sql = 'SELECT \'Found\' FROM Usuario WHERE email = ?';

    db.query(sql, [email], callback);
  }

  static authEmailToken(emailToken, callback) {
    // SQL
    var sql = 'SELECT senha FROM Usuario WHERE emailToken = ?';

    db.query(sql, [emailToken], callback);
  }

  static authPassword(password, encryptedPassword, callback) {
    auth.compare(password, encryptedPassword, callback);
  }

  static storeToken(token, emailToken, callback) {
    // SQL
    var sql = 'UPDATE Usuario SET token = ?, emailToken = NULL WHERE emailToken = ?';    

    db.query(sql, [token, emailToken], callback);
  }

  static storeEmailToken(token, email, callback) {
    // SQL
    var sql = 'UPDATE Usuario SET emailToken = ? WHERE email = ?';    

    var values = [
      token,
      email
    ]

    db.query(sql, values, callback);
  }

  static cleanTokens(token, field) {
    // SQL
    var sql = 'UPDATE Usuario SET token = NULL, emailToken = NULL WHERE ? = ?';

    db.query(sql, field, token);
  }
}

module.exports = User;