//api_url = 'https://ufsmgo.cloud.local'
const api_url = 'https://ufsmgo-gc8z.onrender.com'

async function api_healthcheck(){
    var healthcheck = api_url+'/healthcheck'
    var res = await fetch(healthcheck)
    if (res.status != 200) return false
    else return true
}

async function get_centro(sigla){
    if (!api_healthcheck) return

    var url = api_url+'/centro'
    if (sigla != 'all'){
        url += '/' + sigla
    }

    res = await fetch(url);
    data = await res.json();
    return data;
}

async function get_evento(centro){
    if (!api_healthcheck) return

    var url = api_url+'/evento'
    if (centro == 'all'){
        url += "/all"
    }
    else {
        url += "?centro=" + centro + "&sort=data_inicio&order=ASC" 
    }
    res = await fetch(url);
    data = await res.json();
    return data;
}

async function get_leaderboard(){
    if (!api_healthcheck) return

    var url = api_url+'/leaderboard'
    res = await fetch(url);
    data = await res.json();
    
    return data;
}

async function atualiza_pontos(pontos){
    if (!api_healthcheck) return
    var playerName = 'admin'
    var url = api_url+'/player/' + playerName + '/pontos?value=' + String(pontos)
    await fetch(url, {method: 'PUT'})
    return
}

async function getPoints(){
    if (!api_healthcheck) return
    var playerName = 'admin'
    var url = api_url+'/player/' + playerName + '/pontos'
    res = await fetch(url);
    data = await res.json();
    return parseInt(data[0].pontos);
}

export default {
    get_centro,
    get_evento,
    get_leaderboard,
    atualiza_pontos,
    getPoints,
    api_url
};