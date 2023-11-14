//######################### IMPORTAÇÕES #########################
import {
    //GET
    get_centro, get_evento, get_leaderboard, get_player_points,
    //PUT
    atualiza_pontos,
    //ETL
    get_data_from_JSON, leaderboard_from_JSON,
} from './http.js'

import {
    open_entered_box, 
    close_entered_box,
    tocarAudio
} from './utils.js'

//######################### CLASSES #########################
class Evento {
    constructor(name, center)
    {
        this.name = name;
        this.center = center;
    }

    print()
    {
        console.log(this.name);
        console.log(this.center);
    }
}

//######################### VARIÁVEIS #########################
var map = L.map('map', {
    zoomControl: false
}).setView([-29.7209, -53.7148], 200); // coordenadas e zoom inicial do mapa

var zoomCtrl = L.control.zoom({
    position: 'bottomright'
}).addTo(map);

// para outras opções de mapas, acesse: https://leaflet-extras.github.io/leaflet-providers/preview/
var CartoDB_Voyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
}).addTo(map);


var playerIcon = L.icon({
    iconUrl: 'img/walking.png',
    iconSize: [50, 50],
    popupAnchor: [0, -40]
});

var UFSM = L.featureGroup([]).addTo(map);

const markers = []; // Array para armazenar os marcadores
const ranges = []; // Array para armazenar os ranges
const eventos = []; // Array para armazenar os eventos

var entered = false;
var infoBox;
var pontuacao;
var playerName;
var sidebarOpen = false;
var qtd_cir=0;
var insideCircles = [];

var player = L.marker([-29.7160, -53.7172],{draggable:true ,icon: playerIcon} ).addTo(map);

//######################### FUNÇÕES MODULARES #########################
function locate_player(){
    map.locate({
            setView: true, 
            watch: true, 
            maxZoom : 200,
            timeout : 5000,
            maximumAge : 1000,
        }) /* This will return map so you can do chaining */
        .on('locationfound', function(e){
            //encontrou o player
            const lat = e.latitude;
            const lng = e.longitude;
            //atualiza a posiçao do marker
            player = player.setLatLng([lat, lng]).update();
            player.bindPopup('Você está aqui! Vamos explorar a UFSM! :)').openPopup();
            
        })
        .on('locationerror', function(e){
            //paniquei
            console.log(e);
            alert("Acesso negado à localização.");
        });
}

async function leaderboard(){
    var myModal = new bootstrap.Modal(document.getElementById('myModal'));
    var leaderboard = await get_leaderboard();
    leaderboard = await leaderboard_from_JSON(leaderboard);
    // Em algum ponto posterior, você pode atualizar os campos do modal diretamente
    myModal.show(); // Exibe o modal

    document.getElementsByClassName('modal-title')[0].innerHTML = 'Leaderboard';
    document.getElementsByClassName('modal-body')[0].innerHTML = leaderboard;
}

function achievements(){
    var myModal = new bootstrap.Modal(document.getElementById('myModal'));

    myModal.show();

    document.getElementsByClassName('modal-title')[0].innerHTML = 'Conquistas';
    
    document.getElementsByClassName('modal-body')[0].innerHTML = ''

    for (let i = 0; i < 4; i++) {
        let num
        i==0 ? num =10 : num =50*i;

    if (pontuacao >= i * 50 && pontuacao > 0)
        var imgHtml = '<img src="img/Icon0' + String(i) + '.png" width="100" height="100" title=" Conquistou ' +String(num)+ ' pontos" >';
    else
            var imgHtml = '<img src="img/Blocked.png" width="100" height="100">';
        document.getElementsByClassName('modal-body')[0].innerHTML += imgHtml;
    }
}

function win_achievement(){
    var myModal = new bootstrap.Modal(document.getElementById('myModal'));

    myModal.show();

    document.getElementsByClassName('modal-title')[0].innerHTML = 'Conquista desbloqueada!';
    
    document.getElementsByClassName('modal-body')[0].innerHTML = 'Parabéns, você desbloqueou uma nova conquista!'

    var imgHtml = '<img src="img/Furry.png" width="400" height="400">';

    document.getElementsByClassName('modal-body')[0].innerHTML += imgHtml;

    tocarAudio("audio/achievement.mp3");

}

//######################### MANIPULAÇÃO DE HTML #########################
document.getElementById('gps-button').addEventListener('click', function() {
    //watcher = navigator.geolocation.watchPosition(success, error);
    locate_player();
});

document.getElementById('centralize-button').addEventListener('click', function() {
    map.setView([player.getLatLng().lat, player.getLatLng().lng]);
});


document.getElementById('sidebar-button').addEventListener('click', function() {
    tocarAudio("audio/menu.mp3")
    var sidebar = document.getElementById('sidebar');
    var sidebarBtn = document.getElementById('sidebar-button');
    var centralizeBtn = document.getElementById('centralize-button');
    var gpsBtn = document.getElementById('gps-button');

    if (sidebarOpen){
        sidebar.classList.remove('active')
        sidebarBtn.style.transform = 'translateX(0px)'
        centralizeBtn.style.transform = 'translateX(0px)'
        gpsBtn.style.transform = 'translateX(0px)'
        sidebarOpen = false;
    } else {
        sidebar.classList.add('active')
        sidebarBtn.style.transform = 'translateX(180px)'
        centralizeBtn.style.transform = 'translateX(180px)'
        gpsBtn.style.transform = 'translateX(180px)'
        sidebarOpen = true;
    }
});

document.getElementById('leaderboard-button').addEventListener('click', function() {
    leaderboard();
    tocarAudio("audio/clickMenu.mp3");
});

document.getElementById('achievement-button').addEventListener('click', function() {
    achievements();
    tocarAudio("audio/clickMenu.mp3");
});

document.getElementById('back-button').addEventListener('click', function() {
    close_entered_box();
});

//######################### MAIN #########################


var turismoIcon = L.icon({
    iconUrl : 'img/statue.png',
    iconSize: [35, 35],
    popupAnchor: [0, -20],
    

});
const data = L.geoJSON(estatuas, {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {icon: turismoIcon});
    },
    
    onEachFeature: function(feature, layer) {
        layer.bindPopup(feature.properties.nome);
    }
}).addTo(map);

const data2 = L.geoJSON(recreacao,{
    onEachFeature: function(feature, layer) {
        layer.bindPopup(feature.properties.nome);
    }
}).addTo(map);

async function main() {
    /*
    var turismoIcon = L.icon({
        
        radius: 2,
        fillColor: "#ff7800",
        color: "#000",
        weight: 100,
        opacity: 1,
        fillOpacity: 0.8
    });
    */
    
    const urlParams = new URLSearchParams(window.location.search);
    playerName = urlParams.get('user') || 'admin';
    //console.log('player eh: ' + player);  

    const centros = await get_centro('all')
    const eventosAll = await get_evento('all')

    pontuacao = await get_player_points(playerName);

    // Crie um elemento <div> para a caixa de exibição
    infoBox = document.getElementById('pontuacao');
    infoBox.innerHTML = '<i class="bi bi-coin"></i>' + '<span id="score">'+ pontuacao + '</span></p>';

    // Adicione a caixa diretamente ao DOM da página
    document.body.appendChild(infoBox);

    if (centros) {
        centros.forEach(centro => {
            const nome = centro.nome;
            const sigla = centro.sigla;
            var lat = centro.latitude;
            var long = centro.longitude;
            var marker = L.marker([lat,long]);
            marker.bindPopup('<b>' + nome + ' - ' + sigla + '</b>' + '<br>Universidade Federal de Santa Maria </br>');

            if (marker){
                marker.addTo(UFSM)
                var circle = L.circle([marker.getLatLng().lat, marker.getLatLng().lng ], {
                    color: 'red',
                    fillColor: '#f03',
                    fillOpacity: 0.5,
                    radius: 50,
                    draggable:false,
                    id: sigla
                }).addTo(UFSM);
                
                marker = L.featureGroup([marker, circle]);
                ranges.push(circle)
                markers.push(marker)
            }
            else{
                console.log("erro no marker")
            }
            
        });
    }
    else{
        console.log("erro nos centros")
    }

    if(eventosAll)
    {
        eventosAll.forEach(evento => {
            centros.forEach(centro => {
                if (evento.centro == centro.sigla){
                    eventos.push(new Evento(evento.nome, centro.sigla))     
                }
            });
        });
    }
    else
    {
        console.log("erro nos eventos")
    }
    /*
    eventos.forEach(evento => {
        evento.print()
    });
    */
   locate_player();
}

// Chama a função main para iniciar o processo
main();

data.on('contextmenu', function(e){
    //console.log(e.layer.feature.properties.nome);
    const nome = e.layer.feature.properties.nome;
    var myModal = new bootstrap.Modal(document.getElementById('myModal'));

    myModal.show();

    document.getElementsByClassName('modal-title')[0].innerHTML = 'Infos sobre a estátua ' + nome + ':';
    document.getElementsByClassName('modal-body')[0].innerHTML = '';

    
    for (const key in e.layer.feature.properties) {
        if (key != "nome"){
            document.getElementsByClassName('modal-body')[0].innerHTML += '<b>' + key + '</b>' + ': ' + e.layer.feature.properties[key] + '<br>';   
        }
    }
});

/// ######################### EVENTOS #########################
UFSM.on('contextmenu', async function (e) {
    const marcadorClicado = e.layer; // Obtém o marcador clicado

    // Verifique se o marcador possui um pop-up vinculado
    if (marcadorClicado && marcadorClicado.getPopup()) {

        tocarAudio("audio/center.mp3");

        //  var conteudoDoPopup = marcadorClicado.getPopup().getContent();
        var sigla = marcadorClicado.getPopup().getContent().split('<br>')[0].split('<b>')[1].split('</b>')[0].split(' - ')[1];
        //console.log("Clicou no marcador: " + sigla);
        
        var dados = await get_evento(sigla);
        var eventosCentro = await get_data_from_JSON(dados)
        //var eventosCentro = JSON.stringify(dados)
        //console.log(eventosCentro)

        var myModal = new bootstrap.Modal(document.getElementById('myModal'));

        // Em algum ponto posterior, você pode atualizar os campos do modal diretamente
        myModal.show(); // Exibe o modal

        document.getElementsByClassName('modal-title')[0].innerHTML = 'Eventos do ' + sigla + ':';
        if(eventosCentro == ""){
            eventosCentro = "Não há eventos cadastrados para este centro!"
        }
        document.getElementsByClassName('modal-body')[0].innerHTML = eventosCentro ;
        
    }
    else if(marcadorClicado && marcadorClicado.getRadius()){
        //console.log("Clicou no circulo de um marcador:");
    }
    // aqui que iremos habilitar uma chamada aos eventos do centro clicado!
});

/*
// Função para pegar a localização do usuário em tempo real
var watcher = navigator.geolocation.watchPosition(success, error);

function success(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    player = player.setLatLng([lat, lng]).update();

    map.setView([lat, lng]);
}

function error(err) {
    if(err.code === 1){
        alert("Please allow location access.");
    }
    else {
        alert("Erro ao pegar localização: " + err);
    }
}
*/

player.on('drag', function(e){
    //navigator.geolocation.clearWatch(watcher);
    map.stopLocate();
});

player.on('move', function (e) {
    // Loop para verificar todos os círculos
    ranges.forEach(function (range) {
        var d = map.distance(e.latlng, range.getLatLng());
        // Verifica se o marcador está dentro do círculo
        if (d < range.getRadius()) {
            range.setStyle({
                fillColor: 'green'
            });
            if(insideCircles.indexOf(range.options.id) == -1){
                insideCircles.push(range.options.id);
            }
        } 
        else {
            range.setStyle({
                fillColor: '#f03'
            });

            // Remove o círculo da lista insideCircles se ele estiver lá
            var index = insideCircles.indexOf(range.options.id);
            if (index !== -1) {
                insideCircles.splice(index, 1);
            }
        }
    });

    if (insideCircles.length > qtd_cir) {
        qtd_cir = insideCircles.length;
        entered = true;

        pontuacao = parseInt(pontuacao);
        pontuacao += 10;
        infoBox.innerHTML = '<i class="bi bi-coin"></i>' + pontuacao;
        atualiza_pontos(playerName, pontuacao);

        if (pontuacao == 10 || pontuacao == 50 || pontuacao == 100 || pontuacao == 150){
            win_achievement();
        }
        else
        {
            open_entered_box();
            tocarAudio("audio/points.mp3");
        }
        //console.log("entrou no círculo");

    } else if (insideCircles.length == 0 && entered) {
        entered = false;
        qtd_cir = 0;

        close_entered_box();
        //console.log("saiu do círculo");
    }
});