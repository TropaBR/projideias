const db = require('../includes/mysqlConn');

exports.getInvitationsFromProject = function(idProject, callback) {
  var sql = "SELECT Invite.id, User.id AS idUser, User.name AS guest, DATE_FORMAT(Invite.dateTimeCreation, \"%d/%m/%y\") as dateTimeCreation, UserSender.name AS sender, Invite.status"
  + " FROM Invite"
  + " LEFT JOIN User ON Invite.guest = User.id"
  + " LEFT JOIN User UserSender ON Invite.sender = UserSender.id"
  + " WHERE project = ?";

  db.query(sql, idProject, callback);
}

exports.createInvite = function(sender, guest, project, comment, callback) {
  var sql = "INSERT INTO Invite(sender, guest, project, comment) VALUES(?, ?, ?, ?)";

  db.query(sql, [sender, guest, project, comment], callback);
}

exports.deleteInvite = function(id, callback) {
  var sql = "DELETE FROM Invite WHERE id = ?";

  db.query(sql, id, callback);
}

exports.getUserInvitations = function(idUser, callback) {
  var sql = "SELECT Invite.id, UserSender.id AS idSender, UserSender.name AS sender, Invite.comment, Project.id AS idProject, Project.name AS project"
  + " FROM Invite"
  + " LEFT JOIN User UserSender ON Invite.sender = UserSender.id"
  + " LEFT JOIN Project ON Invite.project = Project.id"
  + " WHERE guest = ?"
  + " AND Invite.status like '%Pendent%'";

  db.query(sql, idUser, callback);
}

exports.refuseInvite = function(id, callback) {
  var sql = "UPDATE Invite SET status = 'Refused', dateTimeEnded = NOW() WHERE id = ?";

  db.query(sql, id, callback);
}

exports.getInvite = function(id, callback) {
  var sql = "SELECT * FROM Invite WHERE id = ?";

  db.query(sql, id, callback);
}

exports.acceptInvite = function(id, callback) {
  var sql = "UPDATE Invite SET status = 'Accepted', dateTimeEnded = NOW() WHERE id = ?";

  db.query(sql, id, callback);
}