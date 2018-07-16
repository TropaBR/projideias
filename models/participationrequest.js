const db = require('../includes/mysqlConn');

exports.getRequestsToProject = function(idProject, callback) {
  var sql = "SELECT ParticipationRequest.id, User.id AS idUser, User.name AS requester, DATE_FORMAT(ParticipationRequest.dateTimeCreation, \"%d/%m/%y\") as dateTimeCreation, ParticipationRequest.comment, ParticipationRequest.status"
  + " FROM ParticipationRequest"
  + " LEFT JOIN User ON ParticipationRequest.requester = User.id"
  + " WHERE project = ?"
  + " AND status LIKE '%Pendent%'";

  db.query(sql, idProject, callback);
}

exports.getRequest = function(id, callback) {
  var sql = "SELECT * FROM ParticipationRequest WHERE id = ?";

  db.query(sql, id, callback);
}

exports.acceptRequest = function(id, callback) {
  var sql = "UPDATE ParticipationRequest SET status = 'Accepted', dateTimeEnded = NOW() WHERE id = ?";

  db.query(sql, id, callback);
}

exports.refuseRequest = function(id, callback) {
  var sql = "UPDATE ParticipationRequest SET status = 'Refused', dateTimeEnded = NOW() WHERE id = ?";

  db.query(sql, id, callback);
}

exports.applyProject = function(idProject, idRequester, message, callback) {
	var sql = "INSERT INTO ParticipationRequest(project, requester, comment) VALUES(?, ?, ?)";

    db.query(sql, [idProject, idRequester, message], callback);
}

exports.getUserRequests = function(idUser, callback) {
  var sql = "SELECT ParticipationRequest.id, ParticipationRequest.comment, Project.id AS idProject, Project.name AS project"
  + " FROM ParticipationRequest"
  + " LEFT JOIN Project ON ParticipationRequest.project = Project.id"
  + " WHERE requester = ?"
  + " AND ParticipationRequest.status like '%Pendent%'";

  db.query(sql, idUser, callback);
}

exports.deleteRequest = function(id, callback) {
  var sql = "DELETE FROM ParticipationRequest WHERE id = ?";

  db.query(sql, id, callback);
}