const express = require('express')
const app = express()
const mysql = require('mysql2')

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

const port = 8000
app.listen(port, () => console.log(`Server running on port ${port}`))

app.get ('/', function (req, res) {
    connect();
    var sql = "SELECT * FROM ufsmgo.evento";
    con.query(sql, function (err, result) {
        if (err) console.log(err);
        res.send(result);
    });
})