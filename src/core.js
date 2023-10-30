import {
    //GET
    get_centro, get_evento, get_leaderboard, get_player_points,
    //PUT
    atualiza_pontos,
    //ETL
    verify_player, get_data_from_JSON, leaderboard_from_JSON,
    //POST
    cria_usuario,
    //DELETE
    deleta_usuario, 
} from './http.js'
 
var map = L.map('map').setView([-29.7209, -53.7148], 100); // coordenadas e zoom inicial do mapa

// para outras opções de mapas, acesse: https://leaflet-extras.github.io/leaflet-providers/preview/
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
osm.addTo(map);

// como personalizar nossos icones
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

// Em core.js
document.getElementById('gps-button').addEventListener('click', function() {
    gps_button.style.display = 'none';
    watcher = navigator.geolocation.watchPosition(success, error);
});

document.getElementById('centralize-button').addEventListener('click', function() {
    map.setView([player.getLatLng().lat, player.getLatLng().lng]);
});

document.getElementById('sidebar-button').addEventListener('click', function() {
   var sidebar = document.getElementById('sidebar');
   sidebar.classList.add('active')
});

async function leaderboard(){
    var myModal = new bootstrap.Modal(document.getElementById('myModal'));
    var leaderboard = await get_leaderboard();
    leaderboard = await leaderboard_from_JSON(leaderboard);
    // Em algum ponto posterior, você pode atualizar os campos do modal diretamente
    myModal.show(); // Exibe o modal

    document.getElementsByClassName('modal-title')[0].innerHTML = 'Leaderboard';
    document.getElementsByClassName('modal-body')[0].innerHTML = leaderboard;
}

document.getElementById('leaderboard-button').addEventListener('click', function() {
    leaderboard();
});

function achievements(){
    var myModal = new bootstrap.Modal(document.getElementById('myModal'));

    myModal.show();

    document.getElementsByClassName('modal-title')[0].innerHTML = 'Conquistas';
    
    document.getElementsByClassName('modal-body')[0].innerHTML = ''

    for (let i = 0; i < 4; i++) {
        if (pontuacao >= i * 50 && pontuacao > 0)
            var imgHtml = '<img src="img/Icon0' + String(i) + '.png" width="100" height="100">';
        else
            var imgHtml = '<img src="img/Blocked.png" width="100" height="100">';
        document.getElementsByClassName('modal-body')[0].innerHTML += imgHtml;
    }
}

document.getElementById('achievement-button').addEventListener('click', function() {
    achievements();
});

function win_achievement(){
    var myModal = new bootstrap.Modal(document.getElementById('myModal'));

    myModal.show();

    document.getElementsByClassName('modal-title')[0].innerHTML = 'Conquista desbloqueada!';

    document.getElementsByClassName('modal-body')[0].innerHTML = 'Parabéns, você desbloqueou uma nova conquista!'

    var imgHtml = '<img src="img/Furry.png" width="400" height="400">';

    document.getElementsByClassName('modal-body')[0].innerHTML += imgHtml;

    let beat = new Audio("audio/achievement.mp3");
    beat.play();
}

async function main() {
    const urlParams = new URLSearchParams(window.location.search);
    playerName = urlParams.get('user') || 'admin';
    //console.log('player eh: ' + player);  

    const centros = await get_centro('all')
    const eventosAll = await get_evento('all')

    pontuacao = await get_player_points(playerName);

    // Crie um elemento <div> para a caixa de exibição
    infoBox = document.getElementById('pontuacao');
    infoBox.innerHTML = 'Sua pontuação: ' + pontuacao;

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
}

// Chame a função main para iniciar o processo
main();

var gps_button = document.getElementById('gps-button');

/// EVENTOS
UFSM.on('contextmenu', async function (e) {
    const marcadorClicado = e.layer; // Obtém o marcador clicado

    // Verifique se o marcador possui um pop-up vinculado
    if (marcadorClicado && marcadorClicado.getPopup()) {
        let beat = new Audio("audio/center.mp3");
        beat.play();
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


var player = L.marker([-29.7160, -53.7172],{draggable:true ,icon: playerIcon} ).bindPopup('Vamos explorar a UFSM!').addTo(map).openPopup();

// Função para pegar a localização do usuário em tempo real
var watcher = navigator.geolocation.watchPosition(success, error);

function success(position) {
    gps_button.style.display = 'none';
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    player = player.setLatLng([lat, lng]).update();

    map.setView([lat, lng]);
}

function error(err) {
    if(err.code === 1){
        alert("Please allow location access.");
    }
}

player.on('drag', function(e){
    navigator.geolocation.clearWatch(watcher);
    gps_button.style.display = 'block';
});

var qtd_cir=0;
var insideCircles = [];

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
        infoBox.innerHTML = 'Sua pontuação: ' + pontuacao;
        atualiza_pontos(playerName, pontuacao);

        if (pontuacao == 10 || pontuacao == 50 || pontuacao == 100 || pontuacao == 150){
            win_achievement();
        }
        else
        {
            open_entered_box();
            let beat = new Audio("audio/points.mp3");
            beat.play();
        }
        //console.log("entrou no círculo");

    } else if (insideCircles.length == 0 && entered) {
        entered = false;
        qtd_cir = 0;

        close_entered_box();
        //console.log("saiu do círculo");
    }
});


