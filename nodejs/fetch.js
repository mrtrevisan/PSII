const dotenv = require('dotenv');
dotenv.config();

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

async function saveData(data){
    var client = await connect();

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
    client.release(); 
}
    
function main() {
    fetch(process.env.API_URL)
        .then(response => response.json())
        .then(data => saveData(data))
}

main();