create database ufsmgo;

drop table if exists evento;

create table evento (
	id integer,
    data_inicio varchar(255),
    data_termino varchar(255),
    localizacao varchar(255),
    nome varchar(255),
    link varchar(255),
    primary key(id)
) default charset = utf8mb4;

use ufsmgo;

select * from evento;