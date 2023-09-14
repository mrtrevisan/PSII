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



--postgresql
/*
CREATE TABLE evento (
    id INTEGER PRIMARY KEY,
    data_inicio VARCHAR(255),
    data_termino VARCHAR(255),
    localizacao VARCHAR(255),
    nome VARCHAR(255),
    link VARCHAR(255)
);

CREATE TABLE centro (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255),
    acronimo VARCHAR(10),
    longitude FLOAT,
    latitude FLOAT
);

INSERT INTO centro (nome, longitude, latitude)
VALUES ('Centro de Tecnologia', 'CT', -29.713190291317783, -53.71682910622894),
       ('Centro de Ciêcnias da Saude', 'CCS', -29.71357791320489, -53.71387518235088),
       ('Centro de Ciências Naturais e Exatas', 'CCNE', -29.71448879726987, -53.716452165560874),
       ('Centro de Artes e Letras', 'CAL', -29.718505197133915, -53.71581290533199),
       ('Centro de Ciências Sociais e Humanas', 'CCSH', -29.72061309679607, -53.71865958633839)
*/
