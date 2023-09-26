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