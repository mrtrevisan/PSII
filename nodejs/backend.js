const dotenv = require('dotenv');
dotenv.config();

const express = require('express')
const app = express()

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
    res.json('UfsmGO');
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

app.get('/centro/:index', async function(req, res){
    var {index} = req.params;
    var client = await connect();
    var query = "SELECT * FROM centro WHERE acronimo LIKE '%" + index.toUpperCase() + "%'";
    //console.log(query)
    client.query(query, function(err, result){
        if(err){
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

app.get('/healthcheck', async function(req, res){
    var client = await connect();
    var query = "SELECT NOW() as time";
    client.query(query, function(err, result){
        if(err) {
            return console.error('error running query', err);
        }
        client.release();
        res.status(200).send('ok')
    })
})