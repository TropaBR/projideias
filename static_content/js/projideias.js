var pwPanel = '<div id="passwordPanel">'+
'<label for="password">Senha: </label>'+
'<input id="password" id="password" type="password">'+
'<button id="btnLogin">Entrar</button>'+
'</div>';

function getCookieValue(a) {
    var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
    return b ? b.pop() : '';
}

$("#btnSendEmail").on("click", function(e) {
    var email = $("#email").val();
    e.preventDefault();
    $.post("api/Auth/CheckEmail", { email: email}, function(data, status) {
        console.log('Data: '+ data);
        console.log('Status: '+ status);
        $("#loginForm").append(pwPanel);
        $("#btnLogin").on("click", function(e) {
            var emailToken = getCookieValue('emailToken');
            var pw = $("#password").val();
            e.preventDefault();
            $.post("api/Auth/Login", { emailToken : emailToken, password : pw }, function(data, status) {
                console.log('Data: '+ data);
                console.log('Status: '+ status);
                alert("Logado com token: " + data.token);
            });
        });
        $("#emailPanel").remove();
        document.cookie = "emailToken="+ data.emailToken;
    });
});
