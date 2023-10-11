function doSomething(params) {
    document.getElementById("demo").innerHTML = "Hello World";
    document.getElementById("demo").hidden = !document.getElementById("demo").hidden;
}

function getPoints(){
    return parseInt(localStorage.getItem('pontuacao')) || 0;
}
var inputElement = document.getElementById("pontuacao");
var valorDaFuncao = getPoints();
inputElement.value = valorDaFuncao;

function centraliza(){
    map.setView([player.getLatLng().lat, player.getLatLng().lng]);
}

function activateLocation() {
    gps_button.style.display = 'none';
    watcher = navigator.geolocation.watchPosition(success, error);
}

// Crie um elemento <div> para a caixa de exibição
var pontuacao = parseInt(localStorage.getItem('pontuacao')) || 0;

var infoBox = document.getElementById('pontuacao');
infoBox.innerHTML = 'Sua pontuação: ' + pontuacao;

// Adicione a caixa diretamente ao DOM da página
document.body.appendChild(infoBox);