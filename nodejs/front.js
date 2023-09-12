const dotenv = require('dotenv');
dotenv.config();

const express = require('express')
const app = express()

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
app.get ('/', function (req, res) {
    connect();
    var sql = "SELECT * FROM ufsmgo.evento";
    con.query(sql, function (err, result) {
        if (err) console.log(err);
        res.send(result);
    });
})
*/

var pg = require('pg');
var conString = process.env.PG_URL
    

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`))

app.get('/', function(req, res){
    var client = new pg.Client(conString);
    client.connect()
    var query = "SELECT * FROM evento"
    client.query(query, function(err, result){
        if(err) throw err;
        res.send(result.rows);
    })
})
