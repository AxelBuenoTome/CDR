CREATE DATABASE IF NOT EXISTS atenea;

USE atenea;

CREATE TABLE IF NOT EXISTS students(
	id VARCHAR(8) NOT NULL,
    nom VARCHAR (30),
	PRIMARY KEY(id)
)ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS tasks(
	alumno VARCHAR(8) NOT NULL,
	projecte VARCHAR(30),
	fecha DATE NOT NULL,
    assignatura VARCHAR(30),
    PRIMARY KEY (alumno)
)ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS timetable(
	assignatura VARCHAR(30) NOT NULL,
	dia INT,
    hora INT,
	aula VARCHAR(6),
    PRIMARY KEY(assignatura),
    alumnoid VARCHAR(8) NOT NULL
)ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS marks(
	assignatura VARCHAR(30),
    examen VARCHAR(30),
    nota INT,
    alumnoid VARCHAR(8) NOT NULL,
    CONSTRAINT quealumno
    FOREIGN KEY(alumnoid)
    REFERENCES students(id)
)ENGINE = INNODB;

ALTER TABLE marks ADD alumnoid VARCHAR(8) NOT NULL;
ALTER TABLE marks ADD CONSTRAINT quealumno FOREIGN KEY(alumnoid) REFERENCES students(id);
