//const api_url = 'https://ufsmgo-api.cloud.local'
const api_url = 'https://ufsmgo-api.az.trevisantec.com'

//verifica o estado da API
async function api_healthcheck(){
    var healthcheck = api_url+'/healthcheck';
    var res = await fetch(healthcheck);

    if (res.status != 200) {
        console.log('Erro interno no sistema. Sem resposta do banco de dados');
        return false;
    }
    else return true;
}

//GET pega os dados de um centro ou de todos
async function get_centro(sigla){
    if (!api_healthcheck) return;

    var url = api_url+'/centro';
    if (sigla == 'all'){
        url += '/all';
    } else {
        url += '/' + sigla;
    }
    let res = await fetch(url);

    if (res.status == 500){
        console.log('Erro interno no servidor');
        return null;
    }
    else{
        let data = await res.json();
        return data;
    }
}

//GET pega os dados dos eventos de um centro, ou todos os eventos
async function get_evento(centro){
    if (!api_healthcheck) return;

    var url = api_url+'/evento';

    if (centro == 'all'){
        url += "/all";
    }
    else {
        //pega os eventos FUTUROS do centro 
        url += "?centro=" + centro + "&sort=data_inicio&order=ASC" 
    }
    let res = await fetch(url);

    if (res.status == 500){
        console.log('Erro interno no servidor');
        return null;
    }
    else{
        let data = await res.json();
        return data;
    }

}

//GET pega os 10 jogadores com mais pontos
async function get_leaderboard(){
    if (!api_healthcheck) return

    var url = api_url+'/leaderboard';
    let res = await fetch(url);

    if (res.status == 500){
        console.log('Erro interno no servidor');
        return null;
    }
    else{
        let data = await res.json();
        return data;
    }
}

//GET pega a pontuação do player
async function get_player_points(playerName){
    if (!api_healthcheck) return;

    var url = api_url+'/player/' + playerName;

    let res = await fetch(url);

    if (res.status == 500){
        console.log('Erro interno no servidor');
        return null;
    }
    else{
        let data = await res.json();
        return parseInt(data[0].pontos);
    }
}

//PUT atualiza os pontos do player
async function atualiza_pontos(playerName, pontos){
    if (!api_healthcheck) return;

    var url = api_url+'/player/pontos';
    const data = {"nome" : playerName, "pontos" : String(pontos)};

    let res = await fetch(url, {
        method: 'PUT',
        body : JSON.stringify(data),
        headers : {
            "Content-Type" : "application/json; charset=UTF-8"
        }
    });

    if (res.status == 500){
        console.log('Erro interno no servidor');
        return false;
    }
    else if (res.status == 401){
        console.log('Erro de autenticação');
        return false;
    }
    else{
        return true;
    }
}

async function login(nome, senha){
    if (!api_healthcheck) return false;

    var url = api_url + '/login';
    const data = {"nome" : nome, "senha" : senha};

    let res = await fetch(url, {
        method : 'POST',
        body : JSON.stringify(data),
        headers : {
            "Content-Type" : "application/json; charset=UTF-8"
        }
    });

    //console.log('status do login: ' + res.status);
    if (res.status == 200){
        return true;
    }
    else if (res.status == 401){
        console.log('Erro: Nome ou senha incorretos');
        return false;
    }
}

//POST cria novo usuário
async function cria_usuario(nome, senha){
    if (!api_healthcheck) return;

    var url = api_url + '/player';
    const data = {"nome" : nome, "senha" : senha};

    let res = await fetch(url, {
        method : 'POST',
        body : JSON.stringify(data),
        headers : {
            "Content-Type" : "application/json; charset=UTF-8"
        }
    });

    if (res.status == 500){
        console.log('Erro interno no servidor');
        return false;
    }
    else if (res.status == 401){
        console.log('Erro: Nome de usuário já está em uso');
        return false;
    }
    else{
        return true;
    }
};

//DELETE exclui o usuário
async function deleta_usuario(nome,senha){
    if (!api_healthcheck) return

    var url = api_url + '/player';
    const data = {"nome" : nome, "senha" : senha};

    let res = await fetch(url, {
        method : 'DELETE',
        body : JSON.stringify(data),
        headers : {
            "Content-Type" : "application/json; charset=UTF-8"
        }
    });
    
    if (res.status == 500){
        console.log('Erro interno no servidor');
        return false;
    }
    else if (res.status == 401){
        console.log('Erro: Nome ou senha incorretos');
        return false;
    }
    else{
        return true;
    }
}

//ETL
async function get_data_from_JSON(json){
    var dados = ""
    console.log(json)

    const option = {
        year: 'numeric',
        month: ('long' || 'short' || 'numeric'),
        weekday: ('long' || 'short'),
        day: 'numeric'
    }
    
    json.forEach(e => {
        let dt_ini = new Date(e.data_inicio).toLocaleDateString('pt-br', option)
        let dt_fim = new Date(e.data_termino).toLocaleDateString('pt-br', option)
        let modal = 
            "<h4>" + e.nome + "</h4>" +
            "<p>Início: " + dt_ini + "</p>" +
            "<p>Fim: " + dt_fim + "</p>" +
            "<p>Local: " + e.local + "</p>" +
            '<a href="' + e.link + '" target="_blank">Link: ' + e.link + "</a>" + "<br>"+"<hr>";
        dados += modal
    })

    if (dados == "")
        dados = "<p>Tudo quieto... <br>Não há enventos aqui por enquanto.</p>"

    return dados;
}

//ETL
async function leaderboard_from_JSON(json){
    let rank = ""    
    var i = 1
    console.log(json)
    json.forEach(e => {
        let modal;
        if (i == 1){
            modal = 
                "<p><h3>" + i + "º - " + e.jogador + " - " + e.pontuação + " pontos</h3></p>";
        } else if (i == 2) {
            modal = 
                "<p><h4>" + i + "º - " + e.jogador + " - " + e.pontuação + " pontos</h4></p>";
        } else if (i == 3) {
            modal = 
                "<p><h5>" + i + "º - " + e.jogador + " - " + e.pontuação + " pontos</h5></p>";
        } else {
            modal = 
                "<p><h6>" + i + "º - " + e.jogador + " - " + e.pontuação + " pontos</h6></p>";
        }
        rank += modal
        i+=1
    })

    if (rank == "")
        rank = "<p>Ninguém no leaderboard :( </p>"

    return rank;
}

export {
    //GET
    get_centro,
    get_evento,
    get_leaderboard,
    get_player_points,
    //PUT
    atualiza_pontos,
    //POST
    login,
    cria_usuario,
    //DELETE
    deleta_usuario,
    //ETL
    get_data_from_JSON,
    leaderboard_from_JSON
};