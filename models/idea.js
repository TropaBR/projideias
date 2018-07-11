const db = require('../includes/mysqlConn');

exports.getFilteredIdeas = function(filter, callback) {
    var sql = "SELECT Idea.*, User.name"
    + " FROM Idea"
    + " LEFT JOIN User ON ownerid = User.id"
    + " WHERE Idea.description LIKE '%" + [filter] + "%'"
    + " OR Idea.title LIKE '%" + [filter] + "%'"
    + " OR User.name LIKE '%" + [filter] + "%'";
    
    db.query(sql, callback);
};

exports.getIdeasFromProject = function(id, callback) {
    var sql = "SELECT Idea.*, User.name AS owner"
	+ " FROM ProjectIdea"
    + " LEFT JOIN Idea ON Idea.id = ProjectIdea.idIdea"
    + " LEFT JOIN User ON Idea.ownerid = User.id"
	+ " WHERE idProject = ?";
    
    db.query(sql, [id], callback);
};

exports.getIdeasFromProject = function(id, callback) {
    var sql = "SELECT Idea.*, User.name AS leader"
	+ " FROM ProjectIdea"
    + " LEFT JOIN Idea ON Idea.id = ProjectIdea.idIdea"
    + " LEFT JOIN ProjectParticipant ON ProjectParticipant.idProject = ProjectIdea.idProject"
    + " LEFT JOIN User ON ProjectParticipant.idUser = User.id"
	+ " WHERE idProject = ?";
    
    db.query(sql, [id, id], callback);
};

exports.getIdeasFromUser = function(id, callback) {
    var sql = "SELECT Idea.*"
	+ " FROM Idea"
	+ " WHERE ownerid = ?";
    
    db.query(sql, [id], callback);
};

exports.createIdea = function(values, callback) {
	var title = values.title;
	var ownerid = values.ownerid;
	var description = values.description;
    var sql = 'INSERT INTO Idea(title, ownerid, description) VALUES (?, ?, ?)';

    db.query(sql, [title, ownerid, description], callback);
};

exports.getIdea = function(id, callback) {
	var sql = "SELECT Idea.*, User.name AS owner"
	+ " FROM Idea"
	+ " LEFT JOIN User ON ownerid = User.id"
	+ " WHERE Idea.id = ?";
    
    db.query(sql, id, callback);
};