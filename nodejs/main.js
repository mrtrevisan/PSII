const express = require('express')
const app = express()

const port = 8000
app.listen(port, () => console.log(`Server running on port ${port}`))

var url = 'https://www.ufsm.br/wp-json/wp/v2/eventos'
var url2 = 'https://jsonplaceholder.typicode.com/posts'

app.get('/', function(req, res){
    fetch(url)
       .then(response => response.json())
       .then(data => res.send(data))
})
