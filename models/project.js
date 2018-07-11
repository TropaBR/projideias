const db = require('../includes/mysqlConn');

exports.getProjects = function(filter, selectStatus, callback) {
	var sql = "SELECT Project.id, Project.name, ProjectType.type, ProjectStatus.status, User.name as leader, Project.description"
	+ " FROM Project"
	+ " LEFT JOIN ProjectType ON Project.type = ProjectType.id"
	+ " LEFT JOIN (" // Todo esse SQL abaixo é para consultar a tabela "ProjectStatusHistory" e retornar a linha com o último status de cada projeto
		+ " SELECT ProjectStatusHistory.*"
		+ " FROM ProjectStatusHistory"
		+ " INNER JOIN ("
			+ "SELECT idProject, MAX(timestamp) AS dateTimeStart"
			+ " FROM ProjectStatusHistory"
			+ " GROUP BY idProject"
		+ ") p"
		+ " ON ProjectStatusHistory.idProject = p.idProject"
		+ " AND ProjectStatusHistory.timestamp = p.dateTimeStart"
	+ ") AS ProjectStatusHistory"
	+ " ON Project.id = ProjectStatusHistory.idProject"
	+ " LEFT JOIN ProjectStatus ON ProjectStatusHistory.idProjectStatus = ProjectStatus.id"
	+ " LEFT JOIN ProjectParticipant ON ProjectParticipant.role LIKE '%Líder%' AND Project.id = ProjectParticipant.idProject"
	+ " LEFT JOIN User ON ProjectParticipant.idUser = User.id"
	+ " WHERE Project.private = 0";
	if(filter) {
		sql += " AND ("
			+ "Project.name LIKE '%" + [filter] + "%'"
			+ " OR ProjectType.type LIKE '%" + [filter] + "%'"
			+ " OR User.name LIKE '%" + [filter] + "%'"
			+ " OR Project.description LIKE '%" + [filter] + "%'"
		+ ")";
	}
	if(selectStatus) {
		sql += " AND ProjectStatus.id = " + selectStatus;
	}
	sql += " ORDER BY ProjectStatusHistory.timestamp DESC"; // Para ordenar os projetos pela última atualização de status
	
    db.query(sql, callback);
};

exports.getProjectStatus = function(callback) {
	var sql = "SELECT *"
	+ " FROM ProjectStatus"
	+ " ORDER BY id";
	
	db.query(sql, callback);
}

exports.getProject = function(id, callback) {
	var sql = "SELECT Project.*"
	+ " FROM Project"
	+ " WHERE Project.id = ?";
	
	db.query(sql, id, callback);
}

exports.getParticipants = function(id, callback) {
	var sql = "SELECT User.*, ProjectParticipant.role, ProjectParticipant.dateTimeStart"
	+ " FROM ProjectParticipant"
	+ " LEFT JOIN User ON ProjectParticipant.idUser = User.id"
	+ " WHERE ProjectParticipant.idProject = ?";
	
	db.query(sql, id, callback);
}

exports.getProjectsUsingIdea = function(idIdea, callback) {
	var sql = "SELECT Project.name, ProjectType.type, ProjectStatus.status, User.name as leader, Project.description, Project.id"
	+ " FROM Project"
	+ " LEFT JOIN ProjectType ON Project.type = ProjectType.id"
	+ " LEFT JOIN (" // Todo esse SQL abaixo é para consultar a tabela "ProjectStatusHistory" e retornar a linha com o último status de cada projeto
		+ " SELECT ProjectStatusHistory.*"
		+ " FROM ProjectStatusHistory"
		+ " INNER JOIN ("
			+ "SELECT idProject, MAX(timestamp) AS dateTimeStart"
			+ " FROM ProjectStatusHistory"
			+ " GROUP BY idProject"
		+ ") p"
		+ " ON ProjectStatusHistory.idProject = p.idProject"
		+ " AND ProjectStatusHistory.timestamp = p.dateTimeStart"
	+ ") AS ProjectStatusHistory"
	+ " ON Project.id = ProjectStatusHistory.idProject"
	+ " LEFT JOIN ProjectStatus ON ProjectStatusHistory.idProjectStatus = ProjectStatus.id"
	+ " LEFT JOIN ProjectParticipant ON ProjectParticipant.role LIKE '%Líder%' AND Project.id = ProjectParticipant.idProject"
	+ " LEFT JOIN User ON ProjectParticipant.idUser = User.id"
	+ " LEFT JOIN ProjectIdea ON Project.id = ProjectIdea.idProject"
	+ " WHERE Project.private = 0"
	+ " AND ProjectIdea.idIdea = ?"
	+ " ORDER BY ProjectStatusHistory.timestamp DESC"; // Para ordenar os projetos pela última atualização de status
	
    db.query(sql, idIdea, callback);
};

exports.getProjectLeader = function(id, callback) {
	var sql = "SELECT idProject, idUser, name, lastname, email, dateTimeStart FROM ProjectParticipant"
	+ " LEFT JOIN User ON User.id = idUser"
	+ " WHERE Role = 'Líder' AND idProject = ?";

    db.query(sql, [id], callback);
};

exports.getProjectWithUser = function(id, callback) {
	var sql = "SELECT Project.*, ProjectStatus.status FROM ProjectParticipant"
	+ " LEFT JOIN Project ON Project.id = idProject"
	+ " LEFT JOIN ProjectStatusHistory ON ProjectStatusHistory.idProject = Project.id"
	+ " LEFT JOIN ProjectStatus ON ProjectStatus.id = ProjectStatusHistory.idProjectStatus"
	+ " WHERE idUser = ?"
	+ " ORDER BY ProjectStatusHistory.timestamp DESC"
	+ " LIMIT 1";

    db.query(sql, [id], callback);
};
