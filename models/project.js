const db = require('../includes/mysqlConn');

exports.getProjects = function(filter, selectStatus, callback) {
	var sql = "SELECT Project.name, ProjectType.type, ProjectStatus.status, User.name as leader, Project.description"
	+ " FROM Project"
	+ " LEFT JOIN ProjectType ON Project.type = ProjectType.id"
	+ " LEFT JOIN (" // Todo esse SQL abaixo é para consultar a tabela "ProjectStatusHistory" e retornar a linha com o último status de cada projeto
		+ " SELECT ProjectStatusHistory.*"
		+ " FROM ProjectStatusHistory"
		+ " INNER JOIN ("
			+ "SELECT idProject, MAX(dateTimeStart) AS dateTimeStart"
			+ " FROM ProjectStatusHistory"
			+ " GROUP BY idProject"
		+ ") p"
		+ " ON ProjectStatusHistory.idProject = p.idProject"
		+ " AND ProjectStatusHistory.dateTimeStart = p.dateTimeStart"
	+ ") AS ProjectStatusHistory"
	+ " ON Project.id = ProjectStatusHistory.idProject"
	+ " LEFT JOIN ProjectStatus ON ProjectStatusHistory.idProjectStatus = ProjectStatus.id"
	+ " LEFT JOIN ProjectParticipant ON ProjectParticipant.role LIKE '%Leader%' AND Project.id = ProjectParticipant.idProject"
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
	sql += " ORDER BY ProjectStatusHistory.dateTimeStart DESC"; // Para ordenar os projetos pela última atualização de status
	
    db.query(sql, callback);
};

exports.getProjectStatus = function(callback) {
	var sql = "SELECT *"
	+ " FROM ProjectStatus"
	+ " ORDER BY id";
	
	db.query(sql, callback);
}

exports.getProject = function(id, callback) {
	var sql = "SELECT Project.*, User.name as leader"
	+ " FROM Project"
	+ " LEFT JOIN ProjectParticipant ON ProjectParticipant.role like '%Leader%' and Project.id = ProjectParticipant.idProject"
	+ " LEFT JOIN User ON ProjectParticipant.idUser = User.id"
	+ " WHERE Project.id = ?";
	
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
			+ "SELECT idProject, MAX(dateTimeStart) AS dateTimeStart"
			+ " FROM ProjectStatusHistory"
			+ " GROUP BY idProject"
		+ ") p"
		+ " ON ProjectStatusHistory.idProject = p.idProject"
		+ " AND ProjectStatusHistory.dateTimeStart = p.dateTimeStart"
	+ ") AS ProjectStatusHistory"
	+ " ON Project.id = ProjectStatusHistory.idProject"
	+ " LEFT JOIN ProjectStatus ON ProjectStatusHistory.idProjectStatus = ProjectStatus.id"
	+ " LEFT JOIN ProjectParticipant ON ProjectParticipant.role LIKE '%Leader%' AND Project.id = ProjectParticipant.idProject"
	+ " LEFT JOIN User ON ProjectParticipant.idUser = User.id"
	+ " LEFT JOIN ProjectIdea ON Project.id = ProjectIdea.idProject"
	+ " WHERE Project.private = 0"
	+ " AND ProjectIdea.idIdea = ?"
	+ " ORDER BY ProjectStatusHistory.dateTimeStart DESC"; // Para ordenar os projetos pela última atualização de status
	
    db.query(sql, idIdea, callback);
};