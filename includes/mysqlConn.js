var mysql = require('mysql');
var fs = require('fs');

var configPath = 'config/mysql.json';
var parsed = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));


var mysqlConn  = mysql.createConnection({
  host : parsed.host,
  user : parsed.user,
  password : parsed.password,
  database : parsed.database
});


mysqlConn.connect(function(err) {
  if (err) {
    console.error('error connecting to database: ' + err.stack);
    process.exit();
    return;
  }
});
 
module.exports = mysqlConn;