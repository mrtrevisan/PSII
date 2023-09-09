const dotenv = require('dotenv');
dotenv.config();

const mysql = require('mysql2')

var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_KEY,
    port: process.env.DB_PORT
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

function main() {
    fetch(process.env.API_URL)
        .then(response => response.json())
        .then(data => saveData(data))
}

main();
