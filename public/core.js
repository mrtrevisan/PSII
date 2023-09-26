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

const ranges = []; // Array para armazenar os ranges

var entered = false;

async function main() {
    //UFSM.clearLayers(); // Limpar camadas antes de adicionar novos marcadores

    const centros = await get_centro('all')
    if (centros) {
        centros.forEach(centro => {
            const nome = centro.nome;
            var lat = centro.latitude;
            var long = centro.longitude;
            var marker = L.marker([lat,long]);
            marker.bindPopup('<b>' + nome + '</b>' + '<br>Universidade Federal de Santa Maria </br>');

            if (marker){
                marker.addTo(UFSM)
                var circle = L.circle([marker.getLatLng().lat, marker.getLatLng().lng ], {
                    color: 'red',
                    fillColor: '#f03',
                    fillOpacity: 0.5,
                    radius: 50,
                    draggable:false
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
}

// Chame a função main para iniciar o processo
main();


// Crie um elemento <div> para a caixa de exibição
var pontuacao = parseInt(localStorage.getItem('pontuacao')) || 0;

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

UFSM.eachLayer(function (centro) {
    centro.on('click', function (event) {
        // Seu código de tratamento de evento aqui
        console.log("Clicou em um marcador do LayerGroup" + " " + centro.getLatLng() + " " + centro.getPopup().getContent());
    });
});

var localization, range, zoomed;

var player = L.marker([-29.7160, -53.7172],{draggable:true}).bindPopup('Player').addTo(map);

var player2 = L.featureGroup().addTo(map);

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
    navigator.geolocation.clearWatch(watcher);
});

player.on('move', function(e){

    // distance between the current position of the marker and the center of the circle
    
    var innerEntered = false;
    var isInside = false;
    var insideOf = null;

    ranges.every(range => {
        if (isInside) return false
        
        var d = map.distance(e.latlng, range.getLatLng());

        // the marker is inside the circle when the distance is inferior to the radius
        isInside = d < range.getRadius();
        
       // let's manifest this by toggling the color
        range.setStyle({
            fillColor: isInside ? 'green' : '#f03'
        })

        if (isInside) {
            insideOf = range;
            return false
        }
        else return true
    });

    if (insideOf != null){
        var d = map.distance(e.latlng, insideOf.getLatLng());

        // the marker is inside the circle when the distance is inferior to the radius
        isInside = d < insideOf.getRadius();
        if (!isInside){
            insideOf = null;
        }
    }

    if(isInside && !entered){
        entered = true;
        pontuacao = pontuacao + 10;
        infoBox.innerHTML = 'Sua pontuação: ' + pontuacao;
        localStorage.setItem('pontuacao', pontuacao);
    }
    else if(!isInside && entered){
        entered = false;
    }

});