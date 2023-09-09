--reseta a database
/*
DROP database IF EXISTS ufsmgo;
create database ufsmgo;
*/

use ufsmgo;

--reseta a table
/*
DROP table IF EXISTS evento;
create table evento (
	id integer,
    data_inicio varchar(255),
    data_termino varchar(255),
    localizacao varchar(255),
    nome varchar(255),
    link varchar(255),
    primary key(id)
) default charset = utf8mb4;
*/

select * from evento;