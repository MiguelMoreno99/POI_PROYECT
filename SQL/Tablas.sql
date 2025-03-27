create database POI;

use POI;

create table usuario
(
   id_usuario INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
   Nombre varchar(50) NOT NULL,
   Apellido_paterno varchar(50) NOT NULL,
   Apellido_materno varchar(50) NOT NULL,
   correo_electronico varchar(50) NOT NULL,
   contrasenia varchar(50) NOT NULL,
   estatus INT DEFAULT 1,
   url_archivo varchar(1000) DEFAULT '', 
   fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

insert into usuario (Nombre, Apellido_paterno,Apellido_materno,correo_electronico,contrasenia,url_archivo) values ('Franco','Mendez','Estrada','ckire@gmail.com','manchas','');
insert into usuario (Nombre, Apellido_paterno,Apellido_materno,correo_electronico,contrasenia,url_archivo) values ('Miguel','Moreno','Davila','mmd@gmail.com','12345','');

CREATE TABLE tabla_mensajes
(
id_mensaje int NOT NULL AUTO_INCREMENT PRIMARY KEY, 
texto_mensaje VARCHAR(255) NOT NULL, 
id_usuario1_mensaje INT NOT NULL, 
id_usuario2_mensaje INT NOT NULL, 
fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (id_usuario1_mensaje) REFERENCES usuario(id_usuario), 
FOREIGN KEY (id_usuario2_mensaje) REFERENCES usuario(id_usuario) 
);

create table Grupo
(
   id_grupo INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
   Nombre varchar(50) NOT NULL
);

create table Usuario_Grupo
(
   id_grupo int NOT NULL,
   id_creador int NOT NULL,
   id_usuario int,
   FOREIGN KEY (id_grupo) REFERENCES Grupo(id_grupo),
   FOREIGN KEY (id_creador) REFERENCES usuario(id_usuario),
   FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE tarea 
(
   id_tarea INT AUTO_INCREMENT PRIMARY KEY,
   id_grupo INT NOT NULL,
   id_creador INT NOT NULL,
   id_usuario INT NOT NULL,
   descripcion TEXT NOT NULL,
   fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   estatus INT DEFAULT 0,
   FOREIGN KEY (id_grupo) REFERENCES grupo(id_grupo),
   FOREIGN KEY (id_creador) REFERENCES usuario(id_usuario),
   FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE mensaje_grupo
( 
  id_mensajegrupo INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  id_grupo INT NOT NULL,
  texto varchar(50),
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario),
  FOREIGN KEY (id_grupo) REFERENCES grupo (id_grupo)
);
                
SHOW TABLES;

INSERT INTO tabla_mensajes (texto_mensaje, id_usuario1_mensaje, id_usuario2_mensaje)
VALUES ('Bien', 2, 1);

SELECT texto_mensaje, fecha_creacion, id_usuario1_mensaje
FROM tabla_mensajes
WHERE (id_usuario1_mensaje = 1 AND id_usuario2_mensaje = 2)
OR (id_usuario1_mensaje = 2 AND id_usuario2_mensaje = 1)
ORDER BY fecha_creacion ASC;