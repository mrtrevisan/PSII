const api_url = 'https://ufsmgo.cloud.local'
//const api_url = 'https://ufsmgo-gc8z.onrender.com'

async function api_healthcheck(){
    var healthcheck = api_url+'/healthcheck'
    var res = await fetch(healthcheck)
    if (res.status != 200) return false
    else return true
}

//GET
async function get_centro(sigla){
    if (!api_healthcheck) return

    var url = api_url+'/centro'
    if (sigla != 'all'){
        url += '/' + sigla
    }

    let res = await fetch(url);
    let data = await res.json();
    return data;
}

//GET
async function get_evento(centro){
    if (!api_healthcheck) return

    var url = api_url+'/evento'
    if (centro == 'all'){
        url += "/all"
    }
    else {
        url += "?centro=" + centro + "&sort=data_inicio&order=ASC" 
    }
    let res = await fetch(url);
    let data = await res.json();
    return data;
}

//GET
async function get_leaderboard(){
    if (!api_healthcheck) return

    var url = api_url+'/leaderboard'

    let res = await fetch(url);
    let data = await res.json();
    
    return data;
}

//GET
async function getPoints(){
    if (!api_healthcheck) return

    var playerName = 'admin'
    var url = api_url+'/player/' + playerName;

    let res = await fetch(url);
    let data = await res.json();
    return parseInt(data[0].pontos);
}

//PUT
async function atualiza_pontos(pontos){
    if (!api_healthcheck) return
    var playerName = 'admin'

    var url = api_url+'/player';
    const data = {"player" : playerName, "value" : String(pontos)}

    await fetch(url, {
        method: 'PUT',
        body : JSON.stringify(data),
        headers : {
            "Content-Type" : "application/json; charset=UTF-8"
        }
    })
    return
}

//ETL
async function verify_player(nome, senha){
    if (!api_healthcheck) return

    var url = api_url+'/player/' + nome

    let res = await fetch(url);
    let data = await res.json();

    if (data.length > 0){
        if (data[0].senha == senha) return 1
        else return 0
    } else return -1
};

//POST
async function cria_usuario(nome, senha){
    if (!api_healthcheck) return

    var url = api_url + '/player';
    const data = {"nome" : nome, "senha" : senha};

    await fetch(url, {
        method : 'POST',
        body : JSON.stringify(data),
        headers : {
            "Content-Type" : "application/json; charset=UTF-8"
        }
    });
    return;
};

//DELETE
async function deleta_usuario(nome,senha){
    if (!api_healthcheck) return

    var url = api_url + '/player';
    const data = {"nome" : nome, "senha" : senha};

    await fetch(url, {
        method : 'DELETE',
        body : JSON.stringify(data),
        headers : {
            "Content-Type" : "application/json; charset=UTF-8"
        }
    });
    return;
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
        let modal = 
            "<p>" + i + "º - " + e.jogador + " - " + e.pontuação + " pontos</p>";
        rank += modal
        i+=1
    })

    if (rank == "")
        rank = "<p>Ninguém no leaderboard :( </p>"

    return rank;
}

async function leaderboard(){
    var myModal = new bootstrap.Modal(document.getElementById('myModal'));
    var leaderboard = await get_leaderboard();
    leaderboard = await leaderboard_from_JSON(leaderboard);
    // Em algum ponto posterior, você pode atualizar os campos do modal diretamente
    myModal.show(); // Exibe o modal

    document.getElementsByClassName('modal-title')[0].innerHTML = 'Leaderboard';
    
    document.getElementsByClassName('modal-body')[0].innerHTML = JSON.stringify(leaderboard) ;
}

export {
    //GET
    get_centro,
    get_evento,
    get_leaderboard,
    getPoints,
    //PUT
    atualiza_pontos,
    //ETL
    verify_player,
    //POST
    cria_usuario,
    //DELETE
    deleta_usuario,
    //ETL
    get_data_from_JSON,
    leaderboard_from_JSON,
    leaderboard
};