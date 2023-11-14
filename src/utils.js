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

function criaModal(titulo, body){
    var myModal = new bootstrap.Modal(document.getElementById('myModal'));

    myModal.show();

    document.getElementsByClassName('modal-title')[0].innerHTML = titulo;
    document.getElementsByClassName('modal-body')[0].innerHTML = body;
}

export{
    open_entered_box,
    close_entered_box,
    tocarAudio,
    criaModal  
}