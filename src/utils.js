/*
var inputElement = document.getElementById("pontuacao");
var valorDaFuncao = getPoints();
inputElement.value = valorDaFuncao;
*/

function open_entered_box(){
    var box = document.getElementsByClassName('entered-box');
    if (box[0].style.display == 'none'){
        box[0].style.display = 'block';
    }
}

function close_entered_box(){
    var box = document.getElementsByClassName('entered-box');
    if (box[0].style.display == 'block'){
        box[0].style.display = 'none';
    }
}

function tocarAudio(caminhoDoAudio) {
    var audio = new Audio(caminhoDoAudio);
    audio.play();
}

export{
    open_entered_box,
    close_entered_box,
    tocarAudio  
}