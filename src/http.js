import { API_URL } from "./config.js";
import { centros } from "../data/centros.js";

//verifica o estado da API
async function api_healthcheck() {
    var healthcheck = API_URL+'/healthcheck';

    try {
        var res = await fetch(healthcheck);
    
        if (res.status != 200) {
            throw new Error('Erro na API: ' + res.status);
        }
        
        return true;
    } catch (e) {
        console.log('Ocorreu um erro: ' + e.message);
        return false;
    }
}

//GET pega os dados de um centro ou de todos
async function get_centro(sigla) {
    // if (!api_healthcheck) return;
    var url = API_URL + '/centro';

    if (sigla == 'all'){
        url += '/all';
    } else {
        url += '/' + sigla;
    }

    try {
        let res = await fetch(url);

        if (res.status == 200) {
            let data = await res.json();
            return data;
        }
        else {
            throw new Error('Erro na API: ' + res.status);
        }
    } catch (e) {
        console.log('Ocorreu um erro: ' + e.message + ' | Usando dados locais');
        
        if (sigla == 'all') {
            return centros;
        } else {
            return centros.find(c => c.sigla == sigla);
        }
    }
}

//GET pega os dados dos eventos de um centro, ou todos os eventos
async function get_evento(centro) {
    // if (!api_healthcheck) return;
    var url = API_URL + '/evento';

    if (centro == 'all'){
        url += "/all";
    }
    else {
        //pega os eventos FUTUROS do centro 
        url += "?centro=" + centro + "&sort=data_inicio&order=ASC" 
    }

    try {
        let res = await fetch(url);

        if (res.status == 200){
            let data = await res.json();
            return data;
        }
        else{
            throw new Error('Erro na API: ' + res.status);
        }
    } catch (e) {
        console.log('Ocorreu um erro: ' + e.message);
        return [];
    }
}

//GET pega os 10 jogadores com mais pontos
async function get_leaderboard() {
    // if (!api_healthcheck) return
    var url = API_URL + '/leaderboard';

    try {
        let res = await fetch(url);
    
        if (res.status == 200){
            let data = await res.json();
            return data;
        }
        else {
            throw new Error('Erro na API: ' + res.status);
        }
    } catch (e) {
        console.log('Ocorreu um erro: ' + e.message);
        return [];
    }
}

//GET pega a pontuação do player
async function get_player_points(playerName) {
    // if (!api_healthcheck) return;
    var url = API_URL + '/player/' + playerName;

    try {
        let res = await fetch(url);
    
        if (res.status == 200){
            let data = await res.json();
            return parseInt(data[0].pontos);
        }
        else{
            throw new Error('Erro na API: ' + res.status);
        }
    } catch (e) {
        console.log('Ocorreu um erro: ' + e.message);
        return 0;
    }
}

//PUT atualiza os pontos do player
async function atualiza_pontos(playerName, pontos) {
    // if (!api_healthcheck) return;
    var url = API_URL + '/player/pontos';

    const data = {"nome" : playerName, "pontos" : String(pontos)};

    try {
        let res = await fetch(url, {
            method: 'PUT',
            body : JSON.stringify(data),
            headers : {
                "Content-Type" : "application/json; charset=UTF-8"
            }
        });
    
        if (res.status == 500) {
            throw new Error('Erro interno no servidor');
        }
        else if (res.status == 401) {
            throw new Error('Erro de autenticação');
        }
        
        return true;
    } catch (e) {
        console.log('Ocorreu um erro: ' + e.message);
        return false;
    }
}

async function login(nome, senha) {
    // if (!api_healthcheck) return false;
    var url = API_URL + '/login';

    const data = {"nome" : nome, "senha" : senha};

    try {
        let res = await fetch(url, {
            method : 'POST',
            body : JSON.stringify(data),
            headers : {
                "Content-Type" : "application/json; charset=UTF-8"
            }
        });
    
        if (res.status == 401){
            throw new Error('Erro: Nome ou senha incorretos');
        }

        if (res.status != 200){
            throw new Error('Erro na API: ' + res.status);
        }
        
        return true;
    } catch (e) {
        console.log('Ocorreu um erro: ' + e.message);
        return false;
    }
}

//POST cria novo usuário
async function cria_usuario(nome, senha) {
    // if (!api_healthcheck) return;
    var url = API_URL + '/player';

    const data = {"nome" : nome, "senha" : senha};

    try {
        let res = await fetch(url, {
            method : 'POST',
            body : JSON.stringify(data),
            headers : {
                "Content-Type" : "application/json; charset=UTF-8"
            }
        });
    
        if (res.status == 500) {
            throw new Error('Erro interno no servidor');
        }
        else if (res.status == 401) {
            throw new Error('Erro: Nome de usuário já está em uso');
        }
        else {
            return true;
        }
    } catch (e) {
        console.log('Ocorreu um erro: ' + e.message);
        return false;
    }
};

//DELETE exclui o usuário
async function deleta_usuario(nome,senha) {
    // if (!api_healthcheck) return
    var url = API_URL + '/player';

    const data = {"nome" : nome, "senha" : senha};

    try {
        let res = await fetch(url, {
            method : 'DELETE',
            body : JSON.stringify(data),
            headers : {
                "Content-Type" : "application/json; charset=UTF-8"
            }
        });
        
        if (res.status == 500) {
            throw new Error('Erro interno no servidor');
        }
        else if (res.status == 401) {
            throw new Error('Erro: Nome ou senha incorretos');
        }
        else {
            return true;
        }
    } catch (e) {
        console.log('Ocorreu um erro: ' + e.message);
        return false;
    }
}

//ETL
async function get_data_from_JSON(json) {
    var dados = ""

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
async function leaderboard_from_JSON(json) {
    let rank = ""    
    var i = 1

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