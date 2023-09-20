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


    //var ct = L.marker([-29.7133, -53.7168], {icon: eventoIcon}).addTo(map);
    var ct = L.marker([-29.7133, -53.7168]).addTo(map);
    //ct.bindPopup('<b>Centro de Tecnologia </b><br>Universidade Federal de Santa Maria img src = "./img/ct-visao-area.jpg"');
    ct.bindPopup("<h1>Centro de Tecnologia</h1><p>Universidade Federal de Santa Maria</p><img src = './img/ct.jpg' width = '250' height = '200'>");

    var reitoria = L.marker([-29.7209, -53.7148]).addTo(map);
    reitoria.bindPopup('<b>Reitoria</b><br>Universidade de Santa Maria');

    var ccr = L.marker([-29.7184521203052, -53.71677597449196]); 
    ccr.bindPopup('<b>CCR</b><br>Universidade de Santa Maria');

    UFSM = L.layerGroup([ct, reitoria, ccr]).addTo(map);

    // Layer Control
    var baseMaps = {
        "OpenStreetMap": osm,
        "OpenStreetMap.HOT": osmHOT
    };

    var overlayMaps = {
        "UFSM": UFSM
    };

    var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);

    /// EVENTOS
/*  map.on('mousemove', function(e){
        document.getElementsByClassName('coordinate')[0].innerHTML = 'lat: ' + e.latlng.lat + ' lng: ' + e.latlng.lng;
    });
*/

    navigator.geolocation.watchPosition(success, error);

    var localization, range, zoomed, player;

    function success(position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;


        if(localization){
            map.removeLayer(localization);
            map.removeLayer(range);
        }
        localization = L.marker([lat, lng]).bindPopup('Você está aqui!');
        range = L.circle([lat, lng], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 50
        });

        player = L.featureGroup([localization, range]).addTo(map);

        if(!zoomed){
            zoomed = map.fitBounds(player.getBounds());
        }
        map.setView([lat, lng]);
    }
    function error(err) {
        if(err.code === 1){
            alert("Please allow location access.");
        }
    }
/*

    if (!navigator.geolocation) {
        console.log('Geolocation is not supported by your browser');
    } 
    else {
        setInterval(()=>{
            navigator.geolocation.getCurrentPosition(getPosition);
        },4000);
    }

    function getPosition(position) {
        //console.log(position)
        lat = position.coords.latitude;
        lng = position.coords.longitude;
        accuracy = position.coords.accuracy;

        if(localization){
            map.removeLayer(localization)
        }
        if(range){
            map.removeLayer(range)
        }

        localization = L.marker([lat, lng]).bindPopup('Você está aqui!');
        range = L.circle([lat, lng], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 50
        });

        var player = L.featureGroup([localization, range]).addTo(map);
        //map.fitBounds(player.getBounds());

        console.log("Your Coordinates are: Lat " + lat + ", Long: " + lng + ", Acc: " + accuracy);
    }
    */
   