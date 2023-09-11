const dotenv = require('dotenv');
dotenv.config();

//MySQL
/*
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

function saveDataMYSQL(data) {
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
*/

//PostgreSQL

var pg = require('pg');
var conString = process.env.PG_URL
    
var client = new pg.Client(conString);
function saveData(data){
    
    client.connect()

    data.forEach(element => {
        var query = "INSERT INTO evento (id, data_inicio, data_termino, localizacao, nome, link) VALUES ('"
        + element.id + "', '" + element.acf.evento_inicio + "', '" + element.acf.evento_termino + 
        "', '" + element.acf.evento_local + "', '" + element.acf.evento_nome + 
        "', '" + element.link + "')";
        
        client.query(query, function(err, result) {
            if(err) {
                return console.error('error running query', err);
            }
            console.log("1 record inserted");
        })
    });    
}
    

function main() {
    fetch(process.env.API_URL)
        .then(response => response.json())
        .then(data => saveData(data))
}

main();