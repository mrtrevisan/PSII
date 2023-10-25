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