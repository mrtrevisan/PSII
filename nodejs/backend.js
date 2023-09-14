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

const {Pool} = require('pg');

async function connect(){
    if(global.connection) return global.connection.connect()
    else {
        const pool = new Pool({
            connectionString: process.env.PG_URL
        });
        global.connection = pool
        return pool.connect()
    }
}    

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`))

app.get('/', async function(req, res){
    res.send('UfsmGO');
})

app.get('/centro', async function(req, res){
    var client = await connect();
    var query = "SELECT * FROM centro";
    client.query(query, function(err, result){
        if(err) {
            return console.error('error running query', err);
        }
        client.release();
        res.send(result.rows);
    })
})

app.get('/evento', async function(req, res){
    var client = await connect();
    var query = "SELECT * FROM evento";
    client.query(query, function(err, result){
        if(err) {
            return console.error('error running query', err);
        }
        client.release();
        res.send(result.rows);
    })
})
