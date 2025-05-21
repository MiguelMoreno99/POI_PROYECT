create database POI;
use POI;

-- Tablas -- 

create table usuario
(
   id_usuario INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
   Nombre varchar(50) NOT NULL,
   Apellido_paterno varchar(50) NOT NULL,
   Apellido_materno varchar(50) NOT NULL,
   correo_electronico varchar(50) NOT NULL,
   contrasenia varchar(50) NOT NULL,
   estatus INT DEFAULT 1,
   imagen varchar(500) not null, 
   fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tabla_mensajes
(
id_mensaje int NOT NULL AUTO_INCREMENT PRIMARY KEY, 
texto_mensaje VARCHAR(255) NULL, 
imagen_mensaje varchar(500) null,
id_usuario1_mensaje INT NOT NULL, 
id_usuario2_mensaje INT NOT NULL, 
fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (id_usuario1_mensaje) REFERENCES usuario(id_usuario), 
FOREIGN KEY (id_usuario2_mensaje) REFERENCES usuario(id_usuario) 
);

CREATE TABLE tabla_mensajes_correo
(
id_mensaje int NOT NULL AUTO_INCREMENT PRIMARY KEY,  
id_usuario1_mensaje INT NOT NULL, 
id_usuario2_mensaje INT NOT NULL, 
asunto_correo VARCHAR(255) NOT NULL, 
texto_correo VARCHAR(255) NOT NULL, 
fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (id_usuario1_mensaje) REFERENCES usuario(id_usuario), 
FOREIGN KEY (id_usuario2_mensaje) REFERENCES usuario(id_usuario) 
);

create table Grupo
(
   id_grupo INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
   id_creador int,
   Nombre varchar(50) NOT NULL,
   FOREIGN KEY (id_creador) REFERENCES usuario(id_usuario)
);

create table Usuario_Grupo
(
   id_grupo int NOT NULL,
   id_usuario int,
   FOREIGN KEY (id_grupo) REFERENCES Grupo(id_grupo),
   FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE mensaje_grupo
( 
  id_mensajegrupo INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  id_grupo INT NOT NULL,
  texto varchar(50),
  imagen_mensaje varchar(500) null, 
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario),
  FOREIGN KEY (id_grupo) REFERENCES grupo (id_grupo)
);

CREATE TABLE tarea 
(
   id_tarea INT AUTO_INCREMENT PRIMARY KEY,
   id_grupo INT NOT NULL,
   id_creador INT NOT NULL,
   id_usuario INT NOT NULL,
   titulo varchar(50),
   descripcion varchar(50),
   fecha_vencimiento date,
   fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   estatus INT DEFAULT 0,
   FOREIGN KEY (id_grupo) REFERENCES grupo(id_grupo),
   FOREIGN KEY (id_creador) REFERENCES usuario(id_usuario),
   FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

Create table Logros
(
   id_logro INT AUTO_INCREMENT PRIMARY KEY,
   Nombre TEXT NOT NULL
);

create table Usuario_Logro
(
   id_logro int NOT NULL,
   id_usuario int,
   estatus INT DEFAULT 1,
   FOREIGN KEY (id_logro) REFERENCES Logros(id_logro),
   FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

-- Trigger --

DELIMITER //

CREATE TRIGGER insertar_usuario_grupo
AFTER INSERT ON Grupo
FOR EACH ROW
BEGIN
    INSERT INTO Usuario_Grupo (id_grupo, id_usuario)
    VALUES (NEW.id_grupo, NEW.id_creador);
END;
//

DELIMITER ;

DELIMITER $$

CREATE TRIGGER asignar_logros_a_usuario
AFTER INSERT ON usuario
FOR EACH ROW
BEGIN
    INSERT INTO Usuario_Logro (id_logro, id_usuario, estatus)
    SELECT id_logro, NEW.id_usuario, 0 FROM Logros;
END $$

DELIMITER ;

-- Logros --

INSERT INTO Logros (Nombre)
VALUES ('Completa una tarea');

INSERT INTO Logros (Nombre)
VALUES ('Agrega una tarea');

INSERT INTO Logros (Nombre)
VALUES ('Completa 3 tareas');

INSERT INTO Logros (Nombre)
VALUES ('Agrega 3 tareas');

INSERT INTO Logros (Nombre)
VALUES ('Crea un grupo');

-- Logros --

select * from tabla_mensajes;
select * from usuario;
select * from grupo;
select * from Usuario_Grupo;
select * from tabla_mensajes_correo;
select * from tarea;
select * from Logros;
select * from Usuario_Logro;
select * from mensaje_grupo;

SHOW TABLES;