async function api_healthcheck(){
    var healthcheck = 'https://ufsmgo-gc8z.onrender.com/healthcheck'
    var res = await fetch(healthcheck)
    if (res.status != 200) return false
    else return true
}

async function get_centro(sigla){
    if (!api_healthcheck) return

    var url = 'https://ufsmgo-gc8z.onrender.com/centro'
    if (sigla != 'all'){
        url += '/' + sigla
    }

    res = await fetch(url);
    data = await res.json();
    return data;
}

var map = L.map('map').setView([-29.7209, -53.7148], 100); // coordenadas e zoom inicial do mapa

// para outras opções de mapas, acesse: https://leaflet-extras.github.io/leaflet-providers/preview/
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
osm.addTo(map);

//L.Control.geocoder().addTo(map);    

var osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 19,
    minZoom: 16,
    attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'
});

// MARKERS
// como personalizar nossos icones
var eventoIcon = L.icon({
    iconUrl: 'img/evento.png',
    iconSize: [38, 95],
});

const UFSM = L.layerGroup([]).addTo(map)
// Layer Control
var baseMaps = {
    "OpenStreetMap": osm,
    "OpenStreetMap.HOT": osmHOT
};

var overlayMaps = {
    "UFSM": UFSM
};

var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);

const markers = []; // Array para armazenar os marcadores

async function main() {
    //UFSM.clearLayers(); // Limpar camadas antes de adicionar novos marcadores

    const centros = await get_centro('all')
    console.log(centros)
    
    if (centros) {
        centros.forEach(centro => {
            //const nome = centro.nome;
            const lat = centro.latitude;
            const long = centro.longitude;
            var marker = new L.marker([lat, long]);
            if (marker){
                marker.addTo(map)
                markers.push(marker)
            }
            else{
                console.log("erro no marker")
            }
            //marker.bindPopup('<b>' + nome + '</b>' + '<br>Universidade Federal de Santa Maria </br>');
        });
    }
    else{
        console.log("erro nos centros")
    }
    
    
}
markers.forEach(marker => {
    USFM.addLayer(marker)
})
UFSM.addTo(map)
// Chame a função main para iniciar o processo
main();









//UFSM = L.layerGroup([ct, reitoria, ccr]).addTo(map);




/*
var centros = get_centro("all")

centros.forEach(centro => {
    nome = centro.nome
    lat = centro.latitude
    long = centro.longitude
    var marker = L.marker([lat, long])
    marker.bindPopup('<b>' + nome + '</b>' + '<br>Universidade Federal de Santa Maria </br>')
    marker.addTo(map)
});

var ct = L.marker([-29.7133, -53.7168], {icon: eventoIcon}).addTo(map);
var ct = L.marker([-29.7133, -53.7168]).addTo(map);
//ct.bindPopup('<b>Centro de Tecnologia </b><br>Universidade Federal de Santa Maria img src = "./img/ct-visao-area.jpg"');
ct.bindPopup("<h1>Centro de Tecnologia</h1><p>Universidade Federal de Santa Maria</p><img src = './img/ct.jpg' width = '250' height = '200'>");

var reitoria = L.marker([-29.7209, -53.7148]).addTo(map);
reitoria.bindPopup('<b>Reitoria</b><br>Universidade de Santa Maria');

var ccr = L.marker([-29.7184521203052, -53.71677597449196]); 
ccr.bindPopup('<b>CCR</b><br>Universidade de Santa Maria');
*/


// Crie um elemento <div> para a caixa de exibição
var pontuacao = 10;

var infoBox = L.DomUtil.create('div', 'info-box');
infoBox.innerHTML = 'Sua pontuação: ' + pontuacao;

// Estilize a caixa usando CSS
infoBox.style.position = 'absolute';
infoBox.style.top = '10px';
infoBox.style.right = '10px';
infoBox.style.backgroundColor = 'white';
infoBox.style.padding = '10px';
infoBox.style.border = '1px solid #ccc';
infoBox.style.zIndex = 1000; // Valor maior para ficar acima do mapa

// Adicione a caixa diretamente ao DOM da página
document.body.appendChild(infoBox);

/// EVENTOS
/*  map.on('mousemove', function(e){
        document.getElementsByClassName('coordinate')[0].innerHTML = 'lat: ' + e.latlng.lat + ' lng: ' + e.latlng.lng;
    });
*/
var localization, range, zoomed;

var player = L.marker([-29.7160, -53.7172],{draggable:true}).bindPopup('Player').addTo(map);

var player2 = L.featureGroup().addTo(map);

var teste = L.marker([-29.71, -53.71],{draggable:false}).bindPopup('Vamos usar isso para testar colisao').addTo(map);

range = L.circle([teste.getLatLng().lat, teste.getLatLng().lng ], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 100,
    draggable:false
}).addTo(map);

teste = L.featureGroup([teste, range]);

// Função para pegar a localização do usuário em tempo real
watcher = navigator.geolocation.watchPosition(success, error);
function success(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    player = player.setLatLng([lat, lng]).update();

    /*
    if(localization){
        map.removeLayer(localization);
        map.removeLayer(range);
    }
    localization = L.marker([lat, lng],{draggable:true}).bindPopup('Você está aqui!').addTo(player2);
    
    range = L.circle([localization.getLatLng().lat, localization.getLatLng().lng ], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 50,
        draggable:true
    }).addTo(player2);

    player = L.featureGroup([localization, range]);

    if(!zoomed){
        zoomed = map.fitBounds(player.getBounds());
    }
    */

    map.setView([lat, lng]);
}
function error(err) {
    if(err.code === 1){
        alert("Please allow location access.");
    }
}

player.on('drag', function(e){
    //console.log("sua nova localizao eh: " + e.target.getLatLng());
    //chamar uma funcao para testar colisao aqui dentro
    // OBS: se quiser testar soh ao final da drag, trocar 'drag' por 'dragend'
    // distance between the current position of the marker and the center of the circle
    var d = map.distance(e.latlng, range.getLatLng());

    // the marker is inside the circle when the distance is inferior to the radius
    var isInside = d < range.getRadius();

   // let's manifest this by toggling the color
    range.setStyle({
        fillColor: isInside ? 'green' : '#f03'
    })
    
    navigator.geolocation.clearWatch(watcher);
});

document.addEventListener('keydown', function (e) {
    var stepSize = 0.01; // Define o tamanho do passo para mover o mapa

    switch (e.key) {
        case 'ArrowUp':
            map.panBy([0, -stepSize]);
            break;
        case 'ArrowDown':
            map.panBy([0, stepSize]);
            break;
        case 'ArrowLeft':
            map.panBy([-stepSize, 0]);
            break;
        case 'ArrowRight':
            map.panBy([stepSize, 0]);
            break;
    }
});
   