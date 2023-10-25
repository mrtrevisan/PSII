
/*
var inputElement = document.getElementById("pontuacao");
var valorDaFuncao = getPoints();
inputElement.value = valorDaFuncao;
*/
function centraliza(){
    map.setView([player.getLatLng().lat, player.getLatLng().lng]);
}

function activateLocation() {
    gps_button.style.display = 'none';
    watcher = navigator.geolocation.watchPosition(success, error);
}