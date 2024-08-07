create database plataforma_eventos;
-- drop database plataforma_eventos;
use plataforma_eventos;

create table Organizacoes(
	id_organizacao int PRIMARY KEY not null AUTO_INCREMENT,
	cnpj char(21),
	nome_organizacao varchar(200),
	localizacao text,
	responsavel varchar(200)
);

create table Estrategias(
	id_estrategia int PRIMARY KEY not null AUTO_INCREMENT,
	tipo_estrategia text,
	descricao text,
	efetividade ENUM('Excelente','Boa','Mediana','Ruim','Péssima')
);


create table Eventos(
	id_evento int PRIMARY KEY not null AUTO_INCREMENT,
	nome_evento varchar(200),
	data_evento datetime,
	localizacao_evento text,
	organizacao_id int not null,
	estrategia_id int not null,
    FOREIGN KEY (organizacao_id) references Organizacoes(id_organizacao),
    FOREIGN KEY (estrategia_id) references Estrategias(id_estrategia)
);

SELECT * FROM Organizacoes;
SELECT * FROM Estrategias;
SELECT * FROM Eventos;