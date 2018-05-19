const db = require('../includes/mysqlConn');
const auth = require('bcrypt');

class User {
  constructor() {

  }

  set name(name) {
    this._name = name.charAt(0).toUpperCase() + name.slice(1);
  }

  get name() {
    return this._name;
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

    // Inputs
    var values = [
      email
    ];

    db.query(sql, values, callback);
  }
}

module.exports = User;