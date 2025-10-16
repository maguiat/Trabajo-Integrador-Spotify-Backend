DROP DATABASE IF EXISTS Spotify;
CREATE DATABASE IF NOT EXISTS Spotify;
USE Spotify;

CREATE TABLE pais( 
	id_pais INT PRIMARY KEY AUTO_INCREMENT,
    nombre_pais VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE tipo_usuario (
	id_tipo_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre_tipo ENUM('free', 'standard', 'premium') NOT NULL UNIQUE
);

CREATE TABLE usuario (
	id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nyap VARCHAR(50) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    fecha_nac DATE NOT NULL,
    sexo ENUM('F', 'M') NOT NULL,
    cp VARCHAR(10) NOT NULL,
    id_pais INT NOT NULL,
    tipo_usuario_actual INT NOT NULL,
    fecha_ult_mod_password DATETIME,
    FOREIGN KEY (id_pais) REFERENCES pais(id_pais),
    FOREIGN KEY (tipo_usuario_actual) REFERENCES tipo_usuario(id_tipo_usuario)
);

CREATE TABLE artista (
	id_artista INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    imagen_url VARCHAR(255)
);

CREATE TABLE discografica (
	id_discografica INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    id_pais INT NOT NULL,
    FOREIGN KEY (id_pais) REFERENCES pais(id_pais),
    UNIQUE (nombre, id_pais)
);

CREATE TABLE album (
	id_album INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(50) NOT NULL,
    id_artista INT NOT NULL,
    id_discografica INT NOT NULL,
    imagen_portada VARCHAR(255),
    anio_publicacion YEAR,
    duracion_total_seg INT, 
    FOREIGN KEY (id_artista) REFERENCES artista(id_artista),
    FOREIGN KEY (id_discografica) REFERENCES discografica(id_discografica),
    UNIQUE (id_artista, titulo)
);

CREATE TABLE genero (
	id_genero INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE cancion (
	id_cancion INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(50) NOT NULL,
    duracion_seg INT NOT NULL,
    id_album INT NOT NULL,
    reproducciones BIGINT DEFAULT 0,
    likes BIGINT DEFAULT 0,
    fecha_agregada DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_album) REFERENCES album(id_album)
);

CREATE TABLE cancion_genero (
	id_cancion INT NOT NULL,
    id_genero INT NOT NULL,
	PRIMARY KEY (id_cancion, id_genero),
    FOREIGN KEY (id_cancion) REFERENCES cancion(id_cancion),
    FOREIGN KEY (id_genero) REFERENCES genero(id_genero)
);

CREATE TABLE playlist (
	id_playlist INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(50) NOT NULL,
    id_usuario INT NOT NULL,
    cant_canciones INT,
    estado ENUM('Activa', 'Eliminada') DEFAULT 'Activa',
    fecha_creacion DATETIME,
    fecha_eliminada DATETIME NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    CHECK (estado = 'Activa' OR fecha_eliminada IS NOT NULL)
);

CREATE TABLE playlist_cancion (
	id_cancion INT NOT NULL,
    id_playlist INT NOT NULL,
    orden INT,
	fecha_agregada DATETIME,
	PRIMARY KEY (id_cancion, id_playlist),
    FOREIGN KEY (id_cancion) REFERENCES cancion(id_cancion),
    FOREIGN KEY (id_playlist) REFERENCES playlist(id_playlist)
);

CREATE TABLE suscripcion (
	id_suscripcion INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    tipo_usuario INT NOT NULL,
    fecha_inicio DATETIME,
    fecha_renovacion DATETIME,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (tipo_usuario) REFERENCES tipo_usuario(id_tipo_usuario),
    UNIQUE (id_usuario, fecha_inicio),
    CHECK (fecha_renovacion > fecha_inicio)
);

CREATE TABLE metodo_pago (
	id_metodo_pago INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    tipo_forma_pago ENUM('Credito', 'Debito', 'Efectivo', 'Debito Automatico x Banco') NOT NULL,
    cbu VARCHAR(20) NULL,
    banco_codigo INT,
    nro_tarjeta_masc VARCHAR(20) NOT NULL,
    mes_caduca INT NOT NULL,
    anio_caduca INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE pago (
	id_pago INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    id_suscripcion INT NOT NULL,
    id_metodo_pago INT NOT NULL,
    importe DECIMAL(10, 2),
    fecha_pago DATETIME,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_suscripcion) REFERENCES suscripcion(id_suscripcion),
    FOREIGN KEY (id_metodo_pago) REFERENCES metodo_pago(id_metodo_pago)
);