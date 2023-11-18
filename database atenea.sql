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
    id VARCHAR(8) NOT NULL,
    CONSTRAINT fk_id
    FOREIGN KEY(id)
    REFERENCES students(id)
)ENGINE = INNODB;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'pbetelematica';
flush privileges;

ALTER TABLE tasks DROP COLUMN alumno;
ALTER TABLE timetable DROP COLUMN alumnoid;
DROP TABLE marks;

ALTER TABLE marks ADD FOREIGN KEY (alumno) REFERENCES students(nom) ON DELETE CASCADE;


INSERT INTO students(id, nom)
VALUES ('DDB0080B', 'David Cerezo'),
		('8B3B2B95', 'Axel Bueno');
	


INSERT INTO tasks (projecte, fecha, assignatura) 
VALUES ('Pràctica 1','2023-12-10', 'PBE'),
		('Pràctica 2','2023-12-15', 'PSAVC'),
        ('Entregable Antenas','2023-12-17', 'RP'),
        ('Pràctica 2','2023-12-22', 'TD'),
        ('Pràctica 1','2023-12-28', 'PAE'),
        ('Critical Design Report','2023-12-30', 'PBE'),
        ('Requirement Specification','2023-12-9', 'PBE');

ALTER TABLE timetable DROP PRIMARY KEY;

INSERT INTO timetable(assignatura, dia, hora, aula) 
VALUES('PBE', 2, 08, 'A4105'),
	('TD', 2, 10, 'A2001'),
    ('RP', 2, 12, 'A4105'),
    ('PSAVC', 3, 08, 'A4105'),
    ('TD', 3, 10, 'A2001'),
    ('RP', 3, 12, 'C4S105'),
    ('PBE', 4, 08, 'A4105'),
    ('PAE', 4, 10, 'A4105'),
    ('TD', 4, 12, 'A2001'),
    ('PBE', 5, 08, 'A4105'),
    ('PBE', 5, 10, 'A4105'),
    ('PBE', 6, 08, 'A4105');
    
ALTER TABLE marks MODIFY COLUMN alumnoid VARCHAR(45);

INSERT INTO marks(assignatura, examen, nota, id)
VALUES ('TD','Examen parcial', 8, 'DDB0080B'),
	('RP','LAB 1', 7.8, 'DDB0080B'),
    ('PBE','Puzzle 2', 7, 'DDB0080B'),
    ('PBE','CDR', 9, 'DDB0080B'),
    ('PSAVC','Examen final', 9.5, 'DDB0080B'),
    ('TD','LAB 2', 6.5, 'DDB0080B');

INSERT INTO students(id, nom) VALUES ('2E9D91B','Patata Alentejo');
INSERT INTO students(id, nom) VALUES ('36A4E8B0','David Izkara');