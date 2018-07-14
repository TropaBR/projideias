const db = require('../includes/mysqlConn');

exports.getInvitationsFromProject = function(idProject, callback) {
  var sql = "SELECT User.name AS guest, DATE_FORMAT(Invite.dateTimeCreation, \"%d/%m/%y\") as dateTimeCreation, Invite.status"
  + " FROM Invite"
  + " LEFT JOIN User ON Invite.guest = User.id"
  + " WHERE project = ?";

  db.query(sql, idProject, callback);
}