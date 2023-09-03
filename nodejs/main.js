const mysql = require('mysql2')

var url = 'https://www.ufsm.br/wp-json/wp/v2/eventos'
var url2 = 'https://jsonplaceholder.typicode.com/posts'

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "senha",
    port: "3306"
});

function connect() {
    con.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
    });
}

function saveData(data) {
    connect();
    data.forEach(element => {
        var sql = "INSERT INTO ufsmgo.evento (id, data_inicio, data_termino, localizacao, nome, link) VALUES ('"
                   + element.id + "', '" + element.acf.evento_inicio + "', '" + element.acf.evento_termino + 
                   "', '" + element.acf.evento_local + "', '" + element.acf.evento_nome + 
                   "', '" + element.link + "')";
        console.log(sql);
        con.query(sql, function (err, result) {
            if (err) console.log(err);
            console.log("1 record inserted");
        });
    });
    con.end();
    console.log("Fim do programa");
}

function getData() {
    fetch(url)
        .then(response => response.json())
        .then(data => saveData(data))
}

getData();