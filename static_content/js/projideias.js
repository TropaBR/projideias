function getCookieValue(a) {
    var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
    return b ? b.pop() : '';
}

function getParams(obj) {

    for(var member in obj) {
        var re = new RegExp(member + '=(.*?)(?:(?:&)|$)');

        obj[member] = re.exec(window.location.href)[1];
    }

    return obj;
}

function parseTimestamp(timestamp) {
    date = new Date(timestamp);
    year = date.getFullYear();
    month = date.getMonth()+1;
    dt = date.getDate();

    if (dt < 10) {
    dt = '0' + dt;
    }
    if (month < 10) {
    month = '0' + month;
    }

    return dt +'-' + month + '-' + year;
}

$("#filterForm").on("submit", function(e) {
    e.preventDefault();

    var data = $("#filterForm").serialize();
                
    $.get("api/GetFilteredIdeas", data, function(ideas) {
        ideas = JSON.parse(ideas);
            tbody.children().remove();

        for(i in ideas) {
            var projectRow = '<tr>'+
                '<td>'+ ideas[i].title +'</td>'+
                '<td>'+ ideas[i].name +'</td>'+
                '<td>'+ ideas[i].description +'</td>'+
				'<td><a class="button" href="idea?id='+ ideas[i].id +'">Ver Ideia</a></td>'+
            '</tr>';

            tbody.append(projectRow);
        }
    }).fail(function(status) {
        if(status.status == "404") tbody.children().remove();
    });
});

$("#registerForm").on("submit", function(e) {
    e.preventDefault();

    var form = $(this);
    var emailInputObj = $("#email");
    var passwordInputObj = $("#password");
    var rePasswordInputObj = $("#repeated-password");

    if(passwordInputObj.val() == rePasswordInputObj.val()) {
        $.get("api/UserExists", form.serialize() ).fail(function(status) {
            if(status.status == "404") {                    
                form.children("button").remove();
                form.append(fullForm);
                form.find("#phone").parent().before(emailInputObj.parent());
                form.find("button").before(document.createElement('div'));
                form.off("submit").on("submit", function (e) {
                    if(passwordInputObj.val() == rePasswordInputObj.val()) {
                        rePasswordInputObj.parent().remove();
                        data = form.serialize();
                        e.preventDefault();
                        $.post("api/CreateUser", data, function() {
                            $("h1").html('<h1>Pronto!</h1>');
                            form.before('<h3>Você pode entrar agora</h3>');
                            form.before('<a class="button button-primary" href="login">Entrar</a>');
                            form.remove();
                        }).fail(function(status) {
                            alert("Failure\nStatus: " + status.status);
                        });
                    }
                });
                form.find('div').last().addClass("row").append(($(":password").parent()));
                form.find(".row").slice(0,3).remove();
            }
        });
    }
});

$("#loginForm").on("submit", function(e) {
    e.preventDefault();

    var form = $(this);
    var emailInputObj = $("#email");
    var passwordInputObj = $("#password");

    var data = {
        email : emailInputObj.val(),
        password : passwordInputObj.val()
    };

    $.post("api/Auth/CheckEmail", data, function(content, status) {
        console.log('Content: '+ content);
        console.log('Status: '+ status);
        var pwPanel = '<div id="passwordPanel">'+
            '<label for="password">Senha</label>'+
            '<input id="password" id="password" type="password">'+
            '<div>'+
            '<button class="button-primary">Entrar</button>'+
            '</div>'+
            '</div>';
        form.append(pwPanel);
        form.children("#emailPanel").remove();
        form.off("submit").on("submit", function(e) {
            var pw = $("#password").val();
            e.preventDefault();
            $.post("api/Auth/Login", { password : pw }, function(content, status) {
                window.location.href = '/';
            });
        });
    });
});

$("#createIdeaForm").on("submit", function (e) {
	e.preventDefault();

	var data = $("#createIdeaForm").serialize();
	
	$.post("api/CreateIdea", data, function(response, status) {
		// Aqui vamos redirecionar pra futura tela de visualização de projeto, com o id recebido
		window.location.href = 'idea?id='+ JSON.parse(response).id;
	}).fail(function(status) {
		alert(status.responseText);
		$("#title").focus();
	});
});

$("#projectFilterForm").on("submit", function(e) {
	e.preventDefault();

	var data = $("#projectFilterForm").serialize();
				
	$.get("api/GetProjects", data, function(projects) {
		projects = JSON.parse(projects);
		tbody.children().remove();

		for(i in projects) {
			var projectRow = '<tr>'+
				'<td>'+ projects[i].name +'</td>'+
				'<td>'+ projects[i].type +'</td>'+
				'<td>'+ projects[i].status +'</td>'+
				'<td>'+ projects[i].leader +'</td>'+
				'<td>'+ projects[i].description +'</td>'+
				'<td><a class="button" href="project?id='+ projects[i].id +'">Ver Projeto</a></td>'+
			'</tr>';

			tbody.append(projectRow);
		}
	}).fail(function(status) {
		if(status.status == "404") tbody.children().remove();
	});
});

$("#searchFilterForm").on("submit", function(e) {
	e.preventDefault();

	var tbody = $("#resultSearchTable").children("tbody");
	tbody.children().remove();
	var data = $("#searchFilterForm").serialize();
	if ( data.replace("filter=",'') ) {
		$.get("api/GetProjects", data, function(projects) {
			projects = JSON.parse(projects);
			for(i in projects) {
				var projectRow = '<tr>'+
					'<td><b>PROJETO</b></td>'+
					'<td><b>Nome: </b>'+ projects[i].name +'</td>'+
					'<td><b>Líder: </b>'+ projects[i].leader +'</td>'+
					'<td>'+ projects[i].description +'</td>'+
					'<td><a class="button" href="project?id='+ projects[i].id +'">Ver Projeto</a></td>'+
				'</tr>';

				tbody.append(projectRow);
			}
		}).fail(function(status) {
			;
		});
		
		$.get("api/GetFilteredIdeas", data, function(ideas) {
			ideas = JSON.parse(ideas);
			for(i in ideas) {
				var ideaRow = '<tr>'+
					'<td><b>IDEIA</b></td>'+
					'<td><b>Nome: </b>'+ ideas[i].title +'</td>'+
					'<td><b>Autor: </b>'+ ideas[i].name +'</td>'+
					'<td>'+ ideas[i].description +'</td>'+
					'<td style="text-align: right;"><a class="button" href="idea?id='+ ideas[i].id +'">Ver Ideia</a></td>'+
				'</tr>';

				tbody.append(ideaRow);
			}
		}).fail(function(status) {
			;
		});
		
		$.get("api/GetUsersByName", data, function(users) {
			users = JSON.parse(users);
			for(i in users) {
				var userRow = '<tr>'+
					'<td><b>USUÁRIO</b></td>'+
					'<td><b>Nome: </b>'+ users[i].name +' '+ users[i].lastname +'</td>'+
					'<td><b>'+ users[i].type +'</b></td>'+
					'<td>'+
						( users[i].period ? '<b>'+ users[i].period +'º Período</b><br />' : '' ) +
						'<b>Email: </b>'+ users[i].email +
						'<br ><b>Telefone:</b> '+ users[i].phone +
					'</td>'+
					'<td style="text-align: right;"><a class="button" href="user?id='+ users[i].id +'">Ver Usuário</a></td>'+
				'</tr>';

				tbody.append(userRow);
			}
		}).fail(function(status) {
			;
		});
	}
});

$("#inviteUser").on("submit", function (e) {
	e.preventDefault();

    var container = $(".container");

	var data = $("#inviteUser").serialize();
	data += '&sender=1'; // MUDAR AQUI QUANDO FOR POSSÍVEL PEGAR O ID DO USUÁRIO DA SESSÃO!!!
	
	$.get("api/CreateInvite", data, function(response) {
        alert("Convite enviado!");
		location.reload();
	}).fail(function(status) {
		alert("Não foi possível enviar o convite. Houve um problema no servidor.");
	});
});

$("#updateProject").on("submit", function (e) {
	e.preventDefault();

    var container = $(".container");

	var data = $("#updateProject").serialize();
	
	$.get("api/UpdateProject", data, function(response) {
		location.reload();
		alert("Projeto atualizado!");
	}).fail(function(status) {
		alert("Não foi possível atualizar o projeto. Houve um problema no servidor.");
	});
});

$("#applyProject").on("submit", function (e) {
	e.preventDefault();
	
	var params = {
		id:''
	};
	getParams(params);
	
    var container = $(".container");
	var data = $("#applyProject").serialize();
	
	$.get("api/ApplyProject", data, function(response) {
		alert("Solicitação enviada!");
		window.location.href = "project?id="+ params.id;
	}).fail(function(status) {
		alert("Não foi possível enviar sua solicitação. Houve um problema no servidor.");
	});
});

function deleteInvite(id) {
	if( confirm("Deseja mesmo cancelar esse convite?") ){
		$.get("api/DeleteInvite", {"id": id}, function(status) {
			alert("Convite cancelado");
			location.reload();
		}).fail(function(status) {
			alert("Não foi possível deletar o convite. Ocorreu um erro no servidor.");
		});
	}
}

function acceptRequest(id) {
	if( confirm("Aceitar o usuário no projeto?") ){
		$.get("api/AcceptRequest", {"id": id}, function(status) {
			location.reload();
		}).fail(function(status) {
			alert("Não foi possível aceitar a solicitação. Ocorreu um erro no servidor.");
		});
	}
}

function refuseRequest(id) {
	if( confirm("Recusar a solicitação?") ){
		$.get("api/RefuseRequest", {"id": id}, function(status) {
			location.reload();
		}).fail(function(status) {
			alert("Não foi possível recusar a solicitação. Ocorreu um erro no servidor.");
		});
	}
}

function refuseInvite(id) {
	if( confirm("Recusar o convite?") ){
		$.get("api/RefuseInvite", {"id": id}, function(status) {
			location.reload();
		}).fail(function(status) {
			alert("Não foi possível recusar o convite. Ocorreu um erro no servidor.");
		});
	}
}

function acceptInvite(id) {
	if( confirm("Aceitar fazer parte do projeto?") ){
		$.get("api/AcceptInvite", {"id": id}, function(status) {
			location.reload();
		}).fail(function(status) {
			alert("Não foi possível aceitar o convite. Ocorreu um erro no servidor.");
		});
	}
}

function deleteRequest(id) {
	if( confirm("Deseja mesmo cancelar sua solicitação?") ){
		$.get("api/DeleteRequest", {"id": id}, function(status) {
			alert("Solicitação cancelada");
			location.reload();
		}).fail(function(status) {
			alert("Não foi possível cancelar sua solicitação. Ocorreu um erro no servidor.");
		});
	}
}