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

exports.getRecentProjects = function(nProjects, callback) {
	if ( isNaN(nProjects) ) {
		nProjects = 5;
	}
	var sql = "SELECT Project.id, Project.name, ProjectType.type, ProjectStatus.status, User.name as leader, Project.description, DATE_FORMAT(ProjectHistoryCreation.timestamp, \"%d/%m/%y\") as creationDate"
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
	+ " LEFT JOIN (" // Todo esse SQL abaixo é para consultar a tabela "ProjectStatusHistory" e retornar a linha com o primeiro status de cada projeto (status de projeto criado)
		+ " SELECT ProjectStatusHistory.*"
		+ " FROM ProjectStatusHistory"
		+ " INNER JOIN ("
			+ "SELECT idProject, MIN(timestamp) AS dateTimeStart"
			+ " FROM ProjectStatusHistory"
			+ " GROUP BY idProject"
		+ ") p"
		+ " ON ProjectStatusHistory.idProject = p.idProject"
		+ " AND ProjectStatusHistory.timestamp = p.dateTimeStart"
	+ ") AS ProjectHistoryCreation"
	+ " ON Project.id = ProjectHistoryCreation.idProject"
	+ " WHERE Project.private = 0"
	+ " ORDER BY ProjectHistoryCreation.timestamp DESC" // Para ordenar os projetos pela data de criação
	+ " LIMIT ?";
	
    //db.query(sql, [nProjects], callback);
	db.query(sql, [5], callback); // APAGAR AQUI E USAR A LINHA DE CIMA!!!
};

exports.getProjectTypes = function(callback) {
	var sql = "SELECT *"
		+ " FROM ProjectType";

		db.query(sql, callback);
};

exports.createProject = function(project, owner, callback) {
	db.beginTransaction(function(err) {
		if (err) { console.log(err); }
		db.query('INSERT INTO Project SET ?', project, function (err, result) {
			if (err) {
				return db.rollback(function() {
					console.log(err);
				});
			}
		
			var statusHistory = { idProject: result.insertId, idProjectStatus: 1 };
			var projectParticipant = { idProject: result.insertId, idUser: owner, role: 'Líder' };
		
			db.query('INSERT INTO ProjectParticipant SET ?', projectParticipant, function(err, result) {
				
				if (err) {
					return db.rollback(function() {
						console.log(err);
					});
				}

				db.query('INSERT INTO ProjectStatusHistory SET ?', statusHistory, function (err, result) {
					if (err) {
						return db.rollback(function() {
							console.log(err);
						});
					}
					db.commit(function(err) {
						if (err) {
							return db.rollback(function() {
								console.log(err);
							});
						}
						result.insertId = statusHistory.idProject;
						callback(err, result);
					});
				});
			});			
		});
	});
};