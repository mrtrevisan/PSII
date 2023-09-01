<?php
$url = 'https://www.ufsm.br/wp-json/wp/v2/eventos';
$url2 = 'https://jsonplaceholder.typicode.com/posts';
$json = file_get_contents($url2);
$data = json_decode($json);

var_dump($data)
?>