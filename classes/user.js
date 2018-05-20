const db = require('../includes/mysqlConn');
const auth = require('bcrypt');

class User {
  constructor() {

  }

  set callback(callback) {
    this._callback = callback;
  }

  get callback() {
    return this._callback;
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

  static authUser(emailToken, callback) {
    // SQL
    var sql = 'SELECT senha FROM Usuario WHERE emailToken = ?';

    db.query(sql, [emailToken], callback);
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

  _checkPassword(err, result) {
    console.log(this.password);
    console.log(result.senha);
      this._callback(err, result,
        auth.compareSync(this.password, result.senha));
  }
}

module.exports = User;