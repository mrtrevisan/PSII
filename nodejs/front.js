var stringSimilarity = require("string-similarity");

var maior = 0.0;
var sim, result;

async function main(){
    var data1, data2;

    var url = 'https://ufsmgo.onrender.com/evento'
    res = await fetch(url)
    data1 = await res.json()

    var url2 = 'https://ufsmgo.onrender.com/centro'
    res = await fetch(url2)
    data2 = await res.json()

    data1.forEach(item1 => {
        data2.forEach(item2 =>{
            result = ""
            sim = stringSimilarity.compareTwoStrings(item1.localizacao, item2.nome);
            if( sim > maior){
                maior = sim;
                result = item2.nome;
                console.log(result)
            }
            sim = stringSimilarity.compareTwoStrings(item1.localizacao, item2.acronimo);
            if( sim > maior){
                maior = sim;
                result = item2.nome;
                console.log(result)
            }
        })
        console.log(`Evento ${item1.nome} diz que acontece em ${item1.localizacao} e acontece em ${result}`);
    });
}

main();