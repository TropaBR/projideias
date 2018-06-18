const db = require('../includes/mysqlConn');

exports.getIdeas = function(filter, callback) {
    if(filter) {
        var sql = "SELECT Idea.*, User.name"
        + " FROM Idea"
        + " LEFT JOIN User ON ownerid = User.id"
        + " WHERE Idea.description LIKE '%" + [filter] + "%'"
        + " OR Idea.title LIKE '%" + [filter] + "%'"
        + " OR User.name LIKE '%" + [filter] + "%'";
    } else {
        var sql = "SELECT Idea.*, User.name"
        + " FROM Idea"
        + " LEFT JOIN User ON ownerid = User.id";
    }
    
    db.query(sql, callback);
};

exports.createIdea = function(values, callback) {
	var title = values.title;
	var ownerid = values.ownerid;
	var description = values.description;
    var sql = 'INSERT INTO Idea(title, ownerid, description) VALUES(?, ?, ?)';

    db.query(sql, [title, ownerid, description], callback);
};