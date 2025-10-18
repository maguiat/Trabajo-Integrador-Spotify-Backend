DROP DATABASE IF EXISTS Spotify;
CREATE DATABASE IF NOT EXISTS Spotify;
USE Spotify;

CREATE TABLE pais( 
	id_pais INT PRIMARY KEY AUTO_INCREMENT,
    nombre_pais VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE tipo_usuario (
	id_tipo_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre_tipo VARCHAR(20) NOT NULL UNIQUE
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
    tipo_forma_pago VARCHAR(50) NOT NULL,
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


-- INSERTAR PAÍSES
INSERT INTO pais (nombre_pais) VALUES 
('Argentina'),
('Estados Unidos'),
('Inglaterra'),
('Colombia'),
('España'),
('Chile'),
('Brasil'),
('Canadá'),
('Uruguay'),
('Mexico'),
('Francia'),
('Holanda'),
('Alemania'),
('Suecia');

-- INSERTAR TIPOS DE USUARIO
INSERT INTO tipo_usuario (nombre_tipo) VALUES 
('free'),
('standard'),
('premium');

-- INSERTAR USUARIOS
INSERT INTO usuario (nyap, email, password_hash, fecha_nac, sexo, cp, id_pais, tipo_usuario_actual, fecha_ult_mod_password) VALUES
('Marta Ortiz', 'MORTIZ@mail.com', 'DUMMY_HASH_MORTIZ@MAIL.COM', '1975-09-27', 'F', '1001', 1, 3, '2023-01-01 00:00:00'),
('Irene Ballesteros', 'IBALLESTEROS@mail.com', 'DUMMY_HASH_IBALLESTEROS@MAIL.COM', '1987-10-17', 'F', '1001', 1, 3, '2023-01-01 00:00:00'),
('Camila Ramirez', 'CRAMIREZ@mail.com', 'DUMMY_HASH_CRAMIREZ@MAIL.COM', '1994-08-26', 'F', '1001', 1, 3, '2023-01-01 00:00:00'),
('Manuela Gonzalez', 'MGONZALEZ@mail.com', 'DUMMY_HASH_MGONZALEZ@MAIL.COM', '1981-03-27', 'F', '118942', 4, 3, '2023-01-01 00:00:00'),
('Elena Hernandez', 'EHERNANDEZ@mail.com', 'DUMMY_HASH_EHERNANDEZ@MAIL.COM', '2001-02-10', 'F', '118942', 4, 3, '2023-01-01 00:00:00'),
('Laura Gomez', 'LGOMEZ@mail.com', 'DUMMY_HASH_LGOMEZ@MAIL.COM', '1971-12-12', 'F', '118942', 4, 2, '2023-01-01 00:00:00'),
('Mercedes Sosa', 'MSOSA@mail.com', 'DUMMY_HASH_MSOSA@MAIL.COM', '1981-07-16', 'F', '3', 5, 2, '2023-01-01 00:00:00'),
('María Smith', 'MSMITH@mail.com', 'DUMMY_HASH_MSMITH@MAIL.COM', '2000-05-04', 'F', 'B24', 3, 2, '2023-01-01 00:00:00'),
('Paula Soto', 'PSOTO@mail.com', 'DUMMY_HASH_PSOTO@MAIL.COM', '1974-07-12', 'F', '832 0000', 6, 1, '2023-01-01 00:00:00'),
('Andres Garcia', 'AGARCIA@mail.com', 'DUMMY_HASH_AGARCIA@MAIL.COM', '1995-08-30', 'M', '1001', 1, 3, '2023-01-01 00:00:00'),
('Javier Martinez', 'JMARTINEZ@mail.com', 'DUMMY_HASH_JMARTINEZ@MAIL.COM', '1987-11-22', 'M', '1001', 1, 2, '2023-01-01 00:00:00'),
('Fabian Lopez', 'FLOPEZ@mail.com', 'DUMMY_HASH_FLOPEZ@MAIL.COM', '1988-02-16', 'M', '1001', 1, 1, '2023-01-01 00:00:00'),
('Juan Sanchez', 'JSANCHEZ@mail.com', 'DUMMY_HASH_JSANCHEZ@MAIL.COM', '2003-03-23', 'M', '1001', 1, 1, '2023-01-01 00:00:00'),
('Manuel Rodriguez', 'MRODRIGUEZ@mail.com', 'DUMMY_HASH_MRODRIGUEZ@MAIL.COM', '2003-10-16', 'M', '118942', 4, 2, '2023-01-01 00:00:00'),
('Jorge Diaz', 'JDIAZ@mail.com', 'DUMMY_HASH_JDIAZ@MAIL.COM', '1973-05-23', 'M', '118942', 4, 3, '2023-01-01 00:00:00'),
('Joaquin Lopez', 'JLOPEZ@mail.com', 'DUMMY_HASH_JLOPEZ@MAIL.COM', '1974-03-15', 'M', '118942', 4, 2, '2023-01-01 00:00:00'),
('Sergio Martinez', 'SMARTINEZ@mail.com', 'DUMMY_HASH_SMARTINEZ@MAIL.COM', '1977-07-18', 'M', '118942', 4, 2, '2023-01-01 00:00:00'),
('David Rubio', 'DRUBIO@mail.com', 'DUMMY_HASH_DRUBIO@MAIL.COM', '2001-01-17', 'M', '60000', 9, 2, '2023-01-01 00:00:00'),
('James Watson', 'JWATSON@mail.com', 'DUMMY_HASH_JWATSON@MAIL.COM', '2003-10-22', 'M', '10029', 2, 1, '2023-01-01 00:00:00');
-- INSERTAR ARTISTAS
INSERT INTO artista (nombre, imagen_url) VALUES
('Pink Floyd', 'Pink Floyd.jpg'),
('AC/DC', NULL),
('The Rolling Stones', 'The Rolling Stones.jpg'),
('The Beatles', NULL),
('Guns n Roses', 'Guns n Roses.jpg'),
('Linkin Park', NULL),
('Madonna', 'Madonna.jpg'),
('Fito Paez', NULL),
('Diego Torres', 'Diego Torres.jpg'),
('Shakira', NULL),
('Maluma', 'Maluma.jpg'),
('Carlos Vives', NULL),
('Karol G', 'Karol G.jpg'),
('Yo-Yo Ma', NULL),
('Michael Finnissy', 'Michael Finnissy.jpg'),
('John Adams', NULL),
('John Corigliano', 'John Corigliano.jpg'),
('Terry Riley', NULL),
('Brian John Peter Ferneyhough', 'Brian John Peter Ferneyhough.jpg'),
('Charlie Parker', NULL),
('MIles Davis', 'MIles Davis.jpg'),
('Dizzy Gillespie', NULL),
('Coleman Hawkins', 'Coleman Hawkins.jpg'),
('Billie Holiday', NULL),
('Ray Charles', 'Ray Charles.jpg'),
('Chet Baker', NULL),
('Celia Cruz', 'Celia Cruz.jpg'),
('Ruben Blades', NULL),
('Willie Colon', 'Willie Colon.jpg'),
('Hector Lavoe', NULL),
('Tito Rodriguez', 'Tito Rodriguez.jpg'),
('Luis Enrique', NULL),
('Astor Piazzolla', 'Astor Piazzolla.jpg'),
('Carlos Gardel', NULL),
('Adriana Varela', 'Adriana Varela.jpg'),
('Alberto Podesta', NULL),
('Bajofondo Tango Club', 'Bajofondo Tango Club.jpg'),
('Susana Rinaldi', NULL),
('Dr. Dre', 'Dr. Dre.jpg'),
('Eminem', NULL),
('Snoop Dogg', 'Snoop Dogg.jpg'),
('Jay-Z', NULL),
('Beastie Boys', 'Beastie Boys.jpg'),
('Kanye West', NULL),
('Carl Cox', 'Carl Cox.jpg'),
('Marco Carola', NULL),
('Oscar Mulero', 'Oscar Mulero.jpg'),
('Nina Kraviz', NULL),
('Adam Beyer', 'Adam Beyer.jpg'),
('Solomun', NULL);

-- INSERTAR DISCOGRÁFICAS
INSERT INTO discografica (nombre, id_pais) VALUES
('Sony Music Entertainment', 2),
('Universal Music Group', 2),
('Warner Music Group', 2),
('EMI', 3),
('Apple Records', 3),
('Geffen Records', 2),
('Sire Warner Bros', 2),
('UMG Recordings', 5),
('Elektra Records LLC', 3),
('Atlantic Recording Corporation', 6),
('Atlantic Recording Corporation', 2),
('Rimas Entertainment LLC', 7),
('RCA Records', 5),
('Universal International Music BV', 3),
('Columbia Records', 7),
('BigHit Entertainment', 8),
('Interscope Records', 5),
('Ministry of Sound Recordings Limited', 7),
('WK Records', 2),
('White World Music', 5),
('Epic Records.', 6),
('Internet Money Records', 7),
('Aftermath Entertainment', 2),
('Atlantic', 2),
('Capitol Records', 8),
('CBS', 5),
('CBS Masterworks', 13),
('Commodore', 2),
('Death Row Records', 7),
('Decca', 2),
('Detroit Underground', 2),
('Dial Records', 2),
('Diynamic Music', 13),
('Etcetera Records B.V.', 12),
('Fania Records', 2),
('Inca Records', 4),
('M nus', 8),
('Music Hall', 1),
('Musicraft', 2),
('Naxos Records', 2),
('ND Nueva Direccion En La Cultura', 1),
('NMC', 3),
('Octave', 3),
('Odeon', 1),
('Prestige', 2),
('RCA Victor Red Seal', 13),
('REKIDS', 13),
('Riverside Records', 2),
('Roc-A-Fella Records', 8),
('Roc-A-Fella Records, Universal Music', 7),
('Sony Music', 10),
('Stip Record', 11),
('Tico Records', 2),
('Trova', 9),
('Truesoul', 14),
('UA Latino', 5);

-- INSERTAR ÁLBUMES
INSERT INTO album (titulo, id_artista, id_discografica, imagen_portada, anio_publicacion) VALUES
('Is There Anybody Out There', 1, 4, 'imagenalbum.jpg', 1980),
('Radio Sampler 2xCD', 1, 4, NULL, 1980),
('Delicate Sound Of Thunder', 1, 4, 'imagenalbum.jpg', 1988),
('Abbey Road', 4, 5, NULL, 1969),
('Use Your Illusion II', 5, 6, NULL, 1991),
('Appetite for Destruction', 5, 6, 'imagenalbum.jpg', 1987),
('True Blue', 7, 7, NULL, 1986),
('Like A Virgin', 7, 7, 'imagenalbum.jpg', 1984),
('Fito Paez', 8, 4, NULL, 1992),
('Antologia', 8, 3, 'imagenalbum.jpg', 1995),
('Diego Torres', 9, 4, NULL, 1992),
('Loba', 10, 1, 'imagenalbum.jpg', 2009),
('Pies Descalzos', 10, 3, NULL, 1995),
('Papi Juancho', 11, 1, 'imagenalbum.jpg', 2020),
('Vives', 12, 1, NULL, 2017),
('OCEAN', 13, 3, 'imagenalbum.jpg', 2019),
('Cello Concertos', 14, 27, NULL, 1985),
('Plays Weir, Finnissy, Newman And Skempton', 15, 42, 'imagenalbum.jpg', 1990),
('My father Knew Charles Ives and Harmonielehre', 16, 40, NULL, 1994),
('Pied Piper Fantasy', 17, 46, 'imagenalbum.jpg', 1993),
('Le Secret De La Vie', 18, 52, NULL, 1988),
('Solo Works', 19, 34, 'imagenalbum.jpg', 1992),
('Charlie Parker Sextet', 20, 32, NULL, 1950),
('Relaxin With The Miles Davis Quintet', 21, 45, 'imagenalbum.jpg', 1956),
('Dizzy Gillespie And His All-Stars', 22, 39, NULL, 1946),
('King Of The Tenor Sax', 23, 28, 'imagenalbum.jpg', 1943),
('Distinctive Song Styling', 24, 30, NULL, 1951),
('Yes Indeed!', 25, 24, 'imagenalbum.jpg', 1958),
('Chet Baker In New York', 26, 48, NULL, 1958),
('Son Con Guaguanco', 27, 53, 'imagenalbum.jpg', 1966),
('Maestra Vida', 28, 35, NULL, 1980),
('El Malo', 29, 35, 'imagenalbum.jpg', 1967),
('La Voz', 30, 36, NULL, 1975),
('Tito Rodriguez At The Palladium', 31, 56, 'imagenalbum.jpg', 1960),
('Amor Y Alegria', 32, 26, NULL, 1987),
('Adios Nonino', 33, 54, 'imagenalbum.jpg', 1969),
('Asi Cantaba Carlitos', 34, 44, NULL, 1930),
('Cuando El Rio Suena', 35, 41, 'imagenalbum.jpg', 1998),
('Alma De Bohemio', 36, 38, NULL, 1940),
('Aura', 37, 51, 'imagenalbum.jpg', 2007),
('Monton De Vida', 38, 33, NULL, 1985),
('Let Me Ride', 39, 36, 'imagenalbum.jpg', 1993),
('Kamikaze', 40, 23, NULL, 2018),
('Doggystyle', 41, 29, 'imagenalbum.jpg', 1993),
('The Black Album', 42, 49, NULL, 2003),
('Check Your Head', 43, 25, 'imagenalbum.jpg', 1992),
('Late Registration', 44, 50, NULL, 2005),
('Back To Mine', 45, 43, 'imagenalbum.jpg', 2000),
('Play It Loud!', 46, 37, NULL, 2008),
('Biosfera', 47, 31, 'imagenalbum.jpg', 2015),
('The Remixes', 48, 47, NULL, 2016),
('Ignition Key', 49, 55, 'imagenalbum.jpg', 2019),
('Dance Baby', 50, 33, NULL, 2009);

-- INSERTAR GÉNEROS
INSERT INTO genero (nombre) VALUES
('Rock'),
('Soul'),
('Pop'),
('Música Clasica'),
('Jazz'),
('Salsa'),
('Tango'),
('Hip Hop'),
('Techno');

-- INSERTAR CANCIONES
INSERT INTO cancion (titulo, duracion_seg, id_album, reproducciones, likes) VALUES
('In The Flesh', 195, 1, 1000050, 7500),
('The Thin Ice', 169, 1, 850050, 7600),
('Gone For Bad', 238, 2, 1200400, 6500),
('Fink Is The King', 195, 2, 218500, 8600),
('Shine On You Crazy Diamond', 713, 3, 210000, 4500),
('Yet Another Movie', 250, 3, 4500668, 1500),
('Oh! Darling', 206, 4, 1598634, 256986),
('Come Together', 260, 4, 3568946, 103569),
('Something', 183, 4, 628634, 5698),
('The End', 125, 4, 68946, 3569),
('Open Your Heart', 253, 7, 2500245, 1785444),
('Material Girl', 244, 7, 457788, 68555),
('Open Your Heart', 237, 7, 7500277, 985444),
('Cancion Sobre Cancion', 229, 9, 988100, 578101),
('11 Y 6', 175, 9, 1122554, 245778),
('Y Dale Alegría A Mi Corazón', 315, 10, 1985663, 658874),
('El Amor Después Del Amor', 310, 10, 2100358, 35456),
('Estamos Juntos', 279, 11, 389555, 12488),
('No Tengas Miedo', 265, 11, 258456, 5247),
('Lo Hecho Esta Hecho', 193, 12, 986444, 657112),
('Loba', 189, 12, 3150441, 1244523),
('Años Luz', 221, 12, 1335054, 485777),
('Estoy Aqui', 232, 13, 845300, 247712),
('Hawai', 199, 14, 1325450, 857400),
('La Cura', 176, 14, 750425, 74856),
('Salida de escape', 184, 14, 166582, 37142),
('Ansiedad', 220, 14, 500266, 25004),
('Baby', 241, 16, 70052, 12488),
('Dices que te vas', 191, 16, 1122554, 35456),
('Hoy tengo tiempo', 192, 15, 10458, 24115),
('La tierra prometida', 197, 15, 10047, 3578),
('Mañana', 169, 15, 8507, 1574),
('In A Minor For Cello And Orchestra, Op', 1133, 17, 15934, 0),
('Prelude: Lento Allegro Maestoso', 758, 17, 96306, 4157),
('Intermezzo', 374, 17, 95338, 41),
('Reels', 478, 18, 53402, 340),
('An Mein Klavier', 490, 18, 523452, 984),
('Le Repos Sur Le Lit', 423, 18, 589744, 891),
('My father Knew Charles Ives and Harmonielehre', 581, 19, 292364, 9236),
('Harmonielehre I', 1046, 19, 0, 0),
('Harmonielehre II .The Anfortas Wound', 766, 19, 2585604, 984),
('Sunrise And The Piper s Song', 576, 20, 666667, 6),
('The Rats', 98, 20, 5510, 54),
('The Children is March', 569, 20, 4295153, 157),
('G. Song', 184, 21, 535211, 5352),
('MIce', 131, 21, 564916, 9),
('In The Summer', 394, 21, 4701, 984),
('Time And Motion Study I', 522, 22, 673426, 642),
('Bone Alphabet', 176, 22, 578738, 54),
('Time And Motion Study II', 1352, 22, 714249, 98),
('My Old Flame', 198, 23, 811641, 1164),
('Air Conditioning', 186, 23, 592559, 5),
('Crazeology', 181, 23, 89423798, 158),
('If I Were A Bell', 497, 24, 949856, 4985),
('You are My Everything', 320, 24, 606381, 54),
('It Could Happen To You', 391, 24, 133346, 0),
('A Hand Fulla Gimme', 182, 25, 108807, 880),
('Groovin High', 161, 25, 161, 95),
('Blue N Boogie', 178, 25, 842894, 39),
('I Surrender Dear', 281, 26, 122628, 4157),
('Smack', 166, 26, 123, 41),
('My Ideal', 191, 26, 4552442, 247),
('Lover Man Oh Where Can You Be?', 201, 27, 136450, 984),
('That Ole Devil Called Love', 171, 27, 1325, 891),
('No More', 164, 27, 6261991, 593),
('What Would I Do Without You', 157, 28, 150271, 545),
('It is All Right', 135, 28, 666667, 984),
('I Want To Know', 148, 28, 971539, 340),
('Fair Weather', 420, 29, 164093, 54),
('Polka Dots And Moonbeams', 480, 29, 675467, 157),
('Hotel 49', 594, 29, 9681087, 9236),
('Bemba Colora', 534, 30, 177914, 9),
('Son Con Guaguanco', 171, 30, 931067, 984),
('Es La Humanidad', 145, 30, 7139063, 6),
('El Velorio', 306, 31, 100184, 5352),
('Jazzy', 259, 32, 205557, 5),
('Willie Baby', 162, 32, 7169667, 158),
('Borinquen', 197, 32, 4809732, 642),
('El Todopoderoso', 261, 33, 219379, 54),
('Emborrachame De Amor', 192, 33, 730767, 0),
('Paraiso De Dulzura', 288, 33, 266281, 1164),
('Satin And Lace', 265, 34, 233200, 95),
('Mama Guela', 156, 34, 15518541, 39),
('Te Comiste Un Pan', 157, 34, 210, 4985),
('Desesperado', 230, 35, 247022, 41),
('Tu No Le Amas Le Temes', 267, 35, 1582509, 247),
('Comprendelo', 320, 35, 145, 880),
('Adiós Nonino', 486, 36, 260843, 891),
('Otoño Porteño', 310, 36, 161387638, 593),
('Michelangelo 70', 200, 36, 27647926, 4157),
('Chorra', 136, 37, 274665, 984),
('Dicen Que Dicen', 141, 37, 1644186, 340),
('Ebrio', 146, 37, 54575, 984),
('Aquello', 273, 38, 288486, 157),
('Don Carlos', 239, 38, 167593735, 9236),
('Milongón Del Guruyú', 286, 38, 245, 0),
('Alma De Bohemio', 218, 39, 302308, 984),
('Al Compas Del Corazon', 140, 39, 3523283, 6),
('Temblando', 156, 39, 7657, 54),
('solari yacumenza', 410, 40, 316129, 98),
('flor de piel', 278, 40, 1738831, 5352),
('Clueca la Cueca', 377, 40, 1215, 9),
('Soy Un Circo', 292, 41, 329951, 158),
('La Chanson Des Vieux Amants', 315, 41, 1738, 642),
('Gabbiani', 230, 41, 2315, 54),
('Let Me Ride', 661, 42, 343772, 0),
('One Eight Seven', 258, 42, 1801928, 1164),
('The Ringer', 337, 43, 357594, 39),
('Greatest', 226, 43, 11261476, 4985),
('Lucky You', 244, 43, 297944, 54),
('E Side', 335, 44, 714156, 247),
('Bathtub', 255, 44, 216025, 880),
('G Funk Intro', 145, 44, 30112, 95),
('Encore', 250, 45, 385271, 593),
('Change Clothes', 250, 45, 7557119, 4157),
('Dirt Off Your Shoulder', 258, 45, 3041, 41),
('Jimmy James', 191, 46, 990586, 340),
('Funky Boss', 148, 46, 291527, 984),
('Pass The Mic', 244, 46, 307209, 891),
('Wake Up Mr. West', 41, 47, 412880, 9236),
('Heard Em Say', 204, 47, 472110856, 545),
('Touch The Sky', 236, 47, 452957, 984),
('Give Me Your Love', 528, 48, 267016, 6),
('Pacific 212', 215, 48, 30755, 54),
('Why Can not We Live Together', 287, 48, 2162505, 157),
('The Jingle', 278, 49, 440523, 5352),
('Magic Tribe', 216, 49, 42540796, 9),
('Kimbo', 294, 49, 938720, 984),
('Cova Rosa', 331, 50, 543440, 642),
('Oscos', 340, 50, 310024, 54),
('Doiras', 322, 50, 319672, 98),
('Aus', 565, 51, 481667, 1164),
('Working', 425, 51, 65968, 5),
('Pain In The Ass', 542, 51, 3227, 158),
('Ignition Key', 485, 52, 4819876, 4985),
('The Convertion', 149, 52, 1421912, 54),
('Triangle', 362, 52, 3200699, 524545),
('Country Song', 403, 53, 49580, 880),
('Boys In The Hood', 332, 53, 477856, 95),
('Cloud Dancer', 250, 53, 710247, 39);

-- INSERTAR RELACIONES CANCIÓN-GÉNERO
INSERT INTO cancion_genero (id_cancion, id_genero) VALUES
(1, 1), (2, 1), (3, 1), (3, 2), (4, 1), (5, 1), (6, 3), (6, 1),
(7, 3), (7, 1), (8, 3), (8, 1), (9, 3), (9, 1), (10, 1),
(11, 3), (12, 3), (13, 3), (14, 3), (15, 1), (16, 1), (17, 3),
(18, 3), (19, 3), (20, 3), (21, 3), (22, 3), (23, 3), (24, 3),
(33, 4), (34, 4), (35, 4), (36, 4), (37, 4), (38, 4), (39, 4),
(40, 4), (41, 4), (42, 4), (43, 4), (44, 4), (45, 4), (46, 4),
(47, 4), (48, 4), (49, 4), (50, 4), (51, 5), (52, 5), (53, 5),
(54, 5), (55, 5), (56, 5), (57, 5), (58, 5), (59, 5), (60, 5),
(61, 5), (62, 5), (63, 5), (64, 5), (65, 5), (66, 5), (67, 5),
(68, 5), (69, 5), (70, 5), (71, 5), (72, 6), (73, 6), (74, 6),
(75, 6), (76, 6), (76, 3), (77, 6), (78, 6), (79, 6), (80, 6),
(81, 6), (82, 6), (82, 3), (83, 6), (84, 6), (85, 6), (86, 6),
(87, 6), (88, 7), (89, 7), (90, 7), (91, 7), (92, 7), (93, 7),
(94, 7), (95, 7), (96, 7), (97, 7), (98, 7), (99, 7), (100, 7),
(101, 7), (102, 7), (103, 7), (104, 7), (105, 7), (106, 8),
(107, 8), (108, 8), (109, 8), (110, 8), (111, 8), (112, 8),
(113, 8), (114, 8), (115, 8), (116, 8), (117, 8), (118, 8),
(119, 8), (120, 8), (121, 8), (122, 8), (123, 8), (124, 8),
(125, 9), (126, 9), (127, 9), (128, 9), (128, 3), (129, 9),
(130, 9), (131, 9), (131, 3), (132, 9), (133, 9), (134, 9),
(135, 9), (136, 9), (137, 9), (138, 9), (139, 9), (140, 9);

-- INSERTAR PLAYLISTS
INSERT INTO playlist (titulo, id_usuario, cant_canciones, estado, fecha_creacion, fecha_eliminada) VALUES
('Para correr', 1, 15, 'Activa', '2020-02-27 00:00:00', NULL),
('Para Estudiar', 2, 10, 'Activa', '2019-05-07 00:00:00', NULL),
('Para Gym', 4, 15, 'Eliminada', '2020-03-07 00:00:00', '2020-04-10 00:00:00'),
('Las mejores canciones', 5, 10, 'Activa', '2017-06-06 00:00:00', NULL),
('Mis canciones favoritos', 2, 10, 'Activa', '2016-09-29 00:00:00', NULL),
('Top 20', 12, 20, 'Eliminada', '2016-06-06 00:00:00', '2016-04-12 00:00:00'),
('Mi top 10', 11, 10, 'Activa', '2017-06-16 00:00:00', NULL),
('Lo mejor del Rock', 17, 10, 'Activa', '2018-07-11 00:00:00', NULL),
('Musica Latina', 15, 5, 'Eliminada', '2016-12-11 00:00:00', '2016-02-19 00:00:00'),
('Pop', 15, 6, 'Activa', '2016-06-23 00:00:00', NULL);

-- INSERTAR PLAYLIST_CANCION
-- Relación entre playlists y canciones con orden y fecha de agregación

-- Playlist 1: "Para correr" - Usuario MORTIZ
INSERT INTO playlist_cancion (id_cancion, id_playlist, orden, fecha_agregada) VALUES
(1, 1, 1, '2020-02-27 00:00:00'),  -- In The Flesh
(137, 1, 2, '2020-02-27 00:00:00'), -- Pain In The Ass
(21, 1, 3, '2020-02-27 00:00:00'),  -- Loba
(74, 1, 4, '2020-02-27 00:00:00');  -- Es La Humanidad

-- Playlist 2: "Para Estudiar" - Usuario IBALLESTEROS
INSERT INTO playlist_cancion (id_cancion, id_playlist, orden, fecha_agregada) VALUES
(38, 2, 1, '2019-05-07 00:00:00'), -- Le Repos Sur Le Lit
(41, 2, 2, '2019-05-07 00:00:00'), -- Harmonielehre II .The Anfortas Wound
(42, 2, 3, '2019-05-07 00:00:00'); -- Sunrise And The Piper s Song

-- Playlist 3: "Para Gym" - Usuario MGONZALEZ (Eliminada)
INSERT INTO playlist_cancion (id_cancion, id_playlist, orden, fecha_agregada) VALUES
(45, 3, 1, '2020-03-07 00:00:00'), -- G. Song
(60, 3, 2, '2020-03-07 00:00:00'), -- Smack
(21, 3, 3, '2020-03-07 00:00:00'), -- Loba
(72, 3, 4, '2020-03-07 00:00:00'), -- Bemba Colora
(1, 3, 5, '2020-03-07 00:00:00');  -- In The Flesh

-- Playlist 4: "Las mejores canciones" - Usuario EHERNANDEZ
INSERT INTO playlist_cancion (id_cancion, id_playlist, orden, fecha_agregada) VALUES
(1, 4, 1, '2017-06-06 00:00:00'),  -- In The Flesh
(2, 4, 2, '2017-06-06 00:00:00'),  -- The Thin Ice
(3, 4, 3, '2017-06-06 00:00:00'),  -- Gone For Bad
(5, 4, 4, '2017-06-06 00:00:00');  -- Shine On You Crazy Diamond

-- Playlist 5: "Mis canciones favoritos" - Usuario IBALLESTEROS
INSERT INTO playlist_cancion (id_cancion, id_playlist, orden, fecha_agregada) VALUES
(17, 5, 1, '2016-09-29 00:00:00'), -- El Amor Después Del Amor
(25, 5, 2, '2016-09-29 00:00:00'), -- La Cura
(29, 5, 3, '2016-09-29 00:00:00'); -- Dices que te vas

-- Playlist 6: "Top 20" - Usuario FLOPEZ (Eliminada)
INSERT INTO playlist_cancion (id_cancion, id_playlist, orden, fecha_agregada) VALUES
(5, 6, 1, '2016-06-06 00:00:00'),   -- Shine On You Crazy Diamond
(11, 6, 2, '2016-06-06 00:00:00'),  -- Open Your Heart
(105, 6, 3, '2016-06-06 00:00:00'), -- Gabbiani
(53, 6, 4, '2016-06-06 00:00:00'),  -- Crazeology
(60, 6, 5, '2016-06-06 00:00:00'),  -- Smack
(6, 6, 6, '2016-06-06 00:00:00'),   -- Yet Another Movie
(8, 6, 7, '2016-06-06 00:00:00'),   -- Come Together
(32, 6, 8, '2016-06-06 00:00:00'),  -- Mañana
(40, 6, 9, '2016-06-06 00:00:00'),  -- Harmonielehre I
(29, 6, 10, '2016-06-06 00:00:00'), -- Dices que te vas
(2, 6, 11, '2016-06-06 00:00:00'),  -- The Thin Ice
(97, 6, 12, '2016-06-06 00:00:00'), -- Alma De Bohemio
(77, 6, 13, '2016-06-06 00:00:00'), -- Willie Baby
(15, 6, 14, '2016-06-06 00:00:00'), -- 11 Y 6
(16, 6, 15, '2016-06-06 00:00:00'), -- Y Dale Alegría A Mi Corazón
(86, 6, 16, '2016-06-06 00:00:00'), -- Tu No Le Amas Le Temes
(43, 6, 17, '2016-06-06 00:00:00'), -- The Rats
(35, 6, 18, '2016-06-06 00:00:00'), -- Intermezzo
(18, 6, 19, '2016-06-06 00:00:00'), -- Estamos Juntos
(56, 6, 20, '2016-06-06 00:00:00'); -- It Could Happen To You

-- Playlist 7: "Mi top 10" - Usuario JMARTINEZ
INSERT INTO playlist_cancion (id_cancion, id_playlist, orden, fecha_agregada) VALUES
(54, 7, 1, '2017-06-16 00:00:00'),  -- If I Were A Bell
(98, 7, 2, '2017-06-16 00:00:00'),  -- Al Compas Del Corazon
(82, 7, 3, '2017-06-16 00:00:00'),  -- Satin And Lace
(11, 7, 4, '2017-06-16 00:00:00'),  -- Open Your Heart
(36, 7, 5, '2017-06-16 00:00:00'),  -- Reels
(58, 7, 6, '2017-06-16 00:00:00'),  -- Groovin High
(48, 7, 7, '2017-06-16 00:00:00'),  -- Time And Motion Study I
(31, 7, 8, '2017-06-16 00:00:00'),  -- La tierra prometida
(18, 7, 9, '2017-06-16 00:00:00'),  -- Estamos Juntos
(50, 7, 10, '2017-06-16 00:00:00'); -- Time And Motion Study II

-- Playlist 8: "Lo mejor del Rock" - Usuario SMARTINEZ
INSERT INTO playlist_cancion (id_cancion, id_playlist, orden, fecha_agregada) VALUES
(5, 8, 1, '2018-07-11 00:00:00'),  -- Shine On You Crazy Diamond
(1, 8, 2, '2018-07-11 00:00:00'),  -- In The Flesh
(4, 8, 3, '2018-07-11 00:00:00'),  -- Fink Is The King
(10, 8, 4, '2018-07-11 00:00:00'), -- The End
(15, 8, 5, '2018-07-11 00:00:00'), -- 11 Y 6
(16, 8, 6, '2018-07-11 00:00:00'); -- Y Dale Alegría A Mi Corazón

-- Playlist 9: "Musica Latina" - Usuario JDIAZ (Eliminada)
INSERT INTO playlist_cancion (id_cancion, id_playlist, orden, fecha_agregada) VALUES
(18, 9, 1, '2016-12-11 00:00:00'), -- Estamos Juntos
(14, 9, 2, '2016-12-11 00:00:00'), -- Cancion Sobre Cancion
(19, 9, 3, '2016-12-11 00:00:00'), -- No Tengas Miedo
(23, 9, 4, '2016-12-11 00:00:00'), -- Estoy Aqui
(22, 9, 5, '2016-12-11 00:00:00'); -- Años Luz

-- Playlist 10: "Pop" - Usuario JDIAZ
INSERT INTO playlist_cancion (id_cancion, id_playlist, orden, fecha_agregada) VALUES
(11, 10, 1, '2016-06-23 00:00:00'),  -- Open Your Heart
(19, 10, 2, '2016-06-23 00:00:00'),  -- No Tengas Miedo
(82, 10, 3, '2016-06-23 00:00:00'),  -- Satin And Lace
(131, 10, 4, '2016-06-23 00:00:00'), -- Cova Rosa
(20, 10, 5, '2016-06-23 00:00:00'); -- Lo Hecho Esta Hecho

-- INSERTAR MÉTODOS DE PAGO
INSERT INTO metodo_pago (id_usuario, tipo_forma_pago, cbu, banco_codigo, nro_tarjeta_masc, mes_caduca, anio_caduca) VALUES
(1, 'Efectivo', NULL, 0, 'N/A', 1, 2000),
(1, 'Debito', NULL, 1, '1881', 1, 21),
(2, 'Credito', NULL, 2, '8181', 10, 30),
(3, 'Credito', NULL, 17, '0087', 10, 28),
(4, 'Efectivo', NULL, 0, 'N/A', 1, 2000),
(5, 'Debito Automatico x Banco', '3748', 0, 'N/A', 1, 2000),
(6, 'Debito Automatico x Banco', '2854', 0, 'N/A', 1, 2000),
(7, 'Efectivo', NULL, 0, 'N/A', 1, 2000),
(8, 'Debito', NULL, 15, '8431', 8, 24),
(9, 'Efectivo', NULL, 0, 'N/A', 1, 2000),
(10, 'Debito Automatico x Banco', '0002', 0, 'N/A', 1, 2000),
(11, 'Efectivo', NULL, 0, 'N/A', 1, 2000),
(12, 'Debito', NULL, 12, '3237', 12, 21),
(13, 'Debito', NULL, 19, '5904', 11, 25),
(14, 'Debito Automatico x Banco', '2077', 0, 'N/A', 1, 2000),
(15, 'Credito', NULL, 10, '8431', 5, 29),
(16, 'Credito', NULL, 7, '0005', 4, 20),
(17, 'Debito', NULL, 12, '0007', 2, 20),
(18, 'Debito', NULL, 15, '0009', 3, 30),
(19, 'Debito Automatico x Banco', '4096', 0, 'N/A', 1, 2000),
(11, 'Debito', NULL, 4, '6300', 1, 21),
(2, 'Debito Automatico x Banco', NULL, 2, '1117', 10, 31),
(3, 'Debito', NULL, 1, '0000', 12, 21),
(5, 'Debito', NULL, 1, '5824', 11, 21),
(5, 'Credito', NULL, 1, '4654', 11, 21),
(7, 'Debito Automatico x Banco', NULL, 5, '4454', 12, 21),
(15, 'Debito', NULL, 17, '7879', 11, 25),
(16, 'Efectivo', NULL, 0, 'N/A', 1, 2000),
(16, 'Debito Automatico x Banco', '5478', 0, 'N/A', 1, 2000),
(17, 'Debito', NULL, 17, '5645', 10, 24),
(11, 'Debito', NULL, 7, '4654', 10, 22),
(11, 'Credito', NULL, 7, '6545', 10, 22),
(18, 'Efectivo', NULL, 0, 'N/A', 1, 2000),
(18, 'Debito', NULL, 7, '7987', 11, 25),
(7, 'Debito', NULL, 5, '5454', 10, 23),
(9, 'Credito', NULL, 2, '8485', 5, 22),
(10, 'Debito', NULL, 17, '5645', 10, 24),
(8, 'Debito', NULL, 7, '4654', 10, 22),
(6, 'Credito', NULL, 7, '6545', 10, 22),
(4, 'Debito', NULL, 4, '6300', 1, 21),
(3, 'Credito', NULL, 2, '1117', 10, 31),
(19, 'Credito', NULL, 1, '0000', 12, 21),
(11, 'Debito Automatico x Banco', '9485', 0, 'N/A', 1, 2000);

-- INSERTAR SUSCRIPCIONES
INSERT INTO suscripcion (id_usuario, tipo_usuario, fecha_inicio, fecha_renovacion) VALUES
(1, 3, '2020-01-01 00:00:00', '2020-02-01 00:00:00'),
(1, 3, '2020-02-01 00:00:00', '2020-03-01 00:00:00'),
(6, 2, '2020-02-01 00:00:00', '2020-03-01 00:00:00'),
(1, 3, '2020-03-01 00:00:00', '2020-04-01 00:00:00'),
(6, 2, '2020-03-01 00:00:00', '2020-04-01 00:00:00'),
(2, 3, '2020-03-01 00:00:00', '2020-04-01 00:00:00'),
(3, 3, '2020-03-01 00:00:00', '2020-04-01 00:00:00'),
(4, 3, '2020-03-01 00:00:00', '2020-04-01 00:00:00'),
(7, 2, '2020-03-01 00:00:00', '2020-04-01 00:00:00'),
(8, 2, '2020-03-01 00:00:00', '2020-04-01 00:00:00'),
(9, 1, '2020-03-01 00:00:00', '2020-04-01 00:00:00'),
(10, 3, '2020-03-01 00:00:00', '2020-04-01 00:00:00'),
(11, 2, '2020-03-01 00:00:00', '2020-04-01 00:00:00'),
(1, 3, '2020-04-01 00:00:00', '2020-05-01 00:00:00'),
(2, 3, '2020-04-01 00:00:00', '2020-05-01 00:00:00'),
(3, 3, '2020-04-01 00:00:00', '2020-05-01 00:00:00'),
(4, 3, '2020-04-01 00:00:00', '2020-05-01 00:00:00'),
(5, 3, '2020-04-01 00:00:00', '2020-05-01 00:00:00'),
(6, 2, '2020-04-01 00:00:00', '2020-05-01 00:00:00'),
(7, 2, '2020-04-01 00:00:00', '2020-05-01 00:00:00'),
(8, 2, '2020-04-01 00:00:00', '2020-05-01 00:00:00'),
(9, 1, '2020-04-01 00:00:00', '2020-05-01 00:00:00'),
(10, 3, '2020-04-01 00:00:00', '2020-05-01 00:00:00'),
(11, 2, '2020-04-01 00:00:00', '2020-05-01 00:00:00'),
(1, 3, '2020-05-01 00:00:00', '2020-08-01 00:00:00'),
(2, 3, '2020-05-01 00:00:00', '2020-08-01 00:00:00'),
(3, 3, '2020-05-01 00:00:00', '2020-08-01 00:00:00'),
(4, 3, '2020-05-01 00:00:00', '2020-08-01 00:00:00'),
(5, 3, '2020-05-01 00:00:00', '2020-08-01 00:00:00'),
(6, 2, '2020-05-01 00:00:00', '2020-08-01 00:00:00'),
(7, 2, '2020-05-01 00:00:00', '2020-08-01 00:00:00'),
(8, 2, '2020-05-01 00:00:00', '2020-08-01 00:00:00'),
(9, 1, '2020-05-01 00:00:00', '2020-08-01 00:00:00'),
(10, 3, '2020-05-01 00:00:00', '2020-08-01 00:00:00'),
(11, 2, '2020-05-01 00:00:00', '2020-08-01 00:00:00'),
(12, 1, '2020-05-01 00:00:00', '2020-08-01 00:00:00'),
(13, 1, '2020-05-01 00:00:00', '2020-08-01 00:00:00'),
(14, 2, '2020-05-01 00:00:00', '2020-08-01 00:00:00'),
(15, 3, '2020-05-01 00:00:00', '2020-08-01 00:00:00'),
(16, 2, '2020-06-01 00:00:00', '2020-09-01 00:00:00'),
(17, 2, '2020-06-01 00:00:00', '2020-09-01 00:00:00'),
(18, 2, '2020-06-01 00:00:00', '2020-09-01 00:00:00'),
(19, 1, '2020-07-01 00:00:00', '2020-10-01 00:00:00'),
(1, 3, '2020-08-01 00:00:00', '2020-11-01 00:00:00'),
(2, 3, '2020-08-01 00:00:00', '2020-11-01 00:00:00'),
(3, 3, '2020-08-01 00:00:00', '2020-11-01 00:00:00'),
(4, 3, '2020-08-01 00:00:00', '2020-11-01 00:00:00'),
(5, 3, '2020-08-01 00:00:00', '2020-11-01 00:00:00'),
(6, 2, '2020-08-01 00:00:00', '2020-11-01 00:00:00'),
(7, 2, '2020-08-01 00:00:00', '2020-11-01 00:00:00'),
(8, 2, '2020-08-01 00:00:00', '2020-11-01 00:00:00'),
(9, 1, '2020-08-01 00:00:00', '2020-11-01 00:00:00'),
(10, 3, '2020-08-01 00:00:00', '2020-11-01 00:00:00'),
(11, 2, '2020-08-01 00:00:00', '2020-11-01 00:00:00'),
(12, 1, '2020-08-01 00:00:00', '2020-11-01 00:00:00'),
(13, 1, '2020-08-01 00:00:00', '2020-11-01 00:00:00'),
(16, 2, '2020-09-01 00:00:00', '2020-12-01 00:00:00'),
(17, 2, '2020-09-01 00:00:00', '2020-12-01 00:00:00'),
(18, 2, '2020-09-01 00:00:00', '2020-12-01 00:00:00'),
(19, 1, '2020-10-01 00:00:00', '2021-01-01 00:00:00'),
(1, 3, '2020-11-01 00:00:00', '2021-02-01 00:00:00'),
(2, 3, '2020-11-01 00:00:00', '2021-02-01 00:00:00'),
(3, 3, '2020-11-01 00:00:00', '2021-02-01 00:00:00'),
(4, 3, '2020-11-01 00:00:00', '2021-02-01 00:00:00'),
(5, 3, '2020-11-01 00:00:00', '2021-02-01 00:00:00'),
(6, 2, '2020-11-01 00:00:00', '2021-02-01 00:00:00'),
(7, 2, '2020-11-01 00:00:00', '2021-02-01 00:00:00'),
(8, 2, '2020-11-01 00:00:00', '2021-02-01 00:00:00'),
(9, 1, '2020-11-01 00:00:00', '2021-02-01 00:00:00'),
(10, 3, '2020-11-01 00:00:00', '2021-02-01 00:00:00'),
(11, 2, '2020-11-01 00:00:00', '2021-02-01 00:00:00'),
(12, 1, '2020-11-01 00:00:00', '2021-02-01 00:00:00'),
(13, 1, '2020-11-01 00:00:00', '2021-02-01 00:00:00'),
(16, 2, '2020-12-01 00:00:00', '2021-03-01 00:00:00'),
(17, 2, '2020-12-01 00:00:00', '2021-03-01 00:00:00'),
(18, 2, '2020-12-01 00:00:00', '2021-03-01 00:00:00'),
(19, 1, '2021-01-01 00:00:00', '2021-04-01 00:00:00'),
(1, 3, '2021-02-01 00:00:00', '2021-04-01 00:00:00'),
(2, 3, '2021-02-01 00:00:00', '2021-04-01 00:00:00'),
(3, 3, '2021-02-01 00:00:00', '2021-04-01 00:00:00'),
(4, 3, '2021-02-01 00:00:00', '2021-04-01 00:00:00'),
(5, 3, '2021-02-01 00:00:00', '2021-04-01 00:00:00'),
(6, 2, '2021-02-01 00:00:00', '2021-04-01 00:00:00'),
(7, 2, '2021-02-01 00:00:00', '2021-04-01 00:00:00'),
(8, 2, '2021-02-01 00:00:00', '2021-04-01 00:00:00'),
(9, 1, '2021-02-01 00:00:00', '2021-04-01 00:00:00'),
(10, 3, '2021-02-01 00:00:00', '2021-04-01 00:00:00'),
(11, 2, '2021-02-01 00:00:00', '2021-04-01 00:00:00'),
(12, 1, '2021-02-01 00:00:00', '2021-04-01 00:00:00'),
(13, 1, '2021-02-01 00:00:00', '2021-04-01 00:00:00'),
(16, 2, '2021-03-01 00:00:00', '2021-05-01 00:00:00'),
(17, 2, '2021-03-01 00:00:00', '2021-05-01 00:00:00'),
(18, 2, '2021-03-01 00:00:00', '2021-05-01 00:00:00');

-- INSERTAR PAGOS
INSERT INTO pago (id_usuario, id_suscripcion, id_metodo_pago, importe, fecha_pago) VALUES
(1, 1, 1, 0, '2020-01-01 00:00:00'),
(1, 2, 1, 0, '2020-02-01 00:00:00'),
(2, 6, 3, 100, '2020-02-01 00:00:00'),
(1, 4, 1, 0, '2020-03-01 00:00:00'),
(6, 5, 7, 100, '2020-03-01 00:00:00'),
(2, 6, 3, 0, '2020-03-01 00:00:00'),
(3, 7, 4, 0, '2020-03-01 00:00:00'),
(4, 8, 5, 0, '2020-03-01 00:00:00'),
(7, 9, 8, 100, '2020-03-01 00:00:00'),
(8, 10, 9, 100, '2020-03-01 00:00:00'),
(9, 11, 10, 500, '2020-03-01 00:00:00'),
(10, 12, 11, 0, '2020-03-01 00:00:00'),
(11, 13, 12, 100, '2020-03-01 00:00:00'),
(1, 14, 1, 0, '2020-04-01 00:00:00'),
(2, 15, 22, 100, '2020-04-01 00:00:00'),
(3, 16, 23, 100, '2020-04-01 00:00:00'),
(4, 17, 39, 100, '2020-04-01 00:00:00'),
(5, 18, 6, 100, '2020-04-01 00:00:00'),
(6, 19, 38, 500, '2020-04-01 00:00:00'),
(7, 20, 35, 500, '2020-04-01 00:00:00'),
(1, 21, 2, 500, '2020-04-01 00:00:00'),
(9, 22, 10, 500, '2020-04-01 00:00:00'),
(10, 23, 11, 0, '2020-04-01 00:00:00'),
(11, 24, 31, 100, '2020-04-01 00:00:00'),
(1, 25, 1, 0, '2020-05-01 00:00:00'),
(2, 26, 22, 100, '2020-05-01 00:00:00'),
(3, 27, 23, 100, '2020-05-01 00:00:00'),
(4, 28, 39, 100, '2020-05-01 00:00:00'),
(5, 29, 6, 100, '2020-05-01 00:00:00'),
(6, 30, 38, 500, '2020-05-01 00:00:00'),
(7, 31, 35, 500, '2020-05-01 00:00:00'),
(1, 32, 2, 500, '2020-05-01 00:00:00'),
(9, 33, 10, 500, '2020-05-01 00:00:00'),
(10, 34, 11, 0, '2020-05-01 00:00:00'),
(11, 35, 31, 100, '2020-05-01 00:00:00'),
(12, 36, 13, 800, '2020-05-01 00:00:00'),
(13, 37, 14, 800, '2020-05-01 00:00:00'),
(14, 38, 15, 200, '2020-05-01 00:00:00'),
(15, 39, 16, 0, '2020-05-01 00:00:00'),
(16, 40, 29, 200, '2020-06-01 00:00:00'),
(17, 41, 30, 200, '2020-06-01 00:00:00'),
(18, 42, 34, 200, '2020-06-01 00:00:00'),
(19, 43, 42, 500, '2020-07-01 00:00:00'),
(1, 44, 1, 0, '2020-05-01 00:00:00'),
(2, 45, 22, 100, '2020-08-01 00:00:00'),
(3, 46, 23, 100, '2020-08-01 00:00:00'),
(4, 47, 39, 100, '2020-08-01 00:00:00'),
(5, 48, 6, 100, '2020-08-01 00:00:00'),
(6, 49, 38, 500, '2020-08-01 00:00:00'),
(7, 50, 35, 500, '2020-08-01 00:00:00'),
(1, 51, 2, 500, '2020-08-01 00:00:00'),
(9, 52, 10, 500, '2020-08-01 00:00:00'),
(10, 53, 11, 0, '2020-08-01 00:00:00'),
(11, 54, 31, 100, '2020-08-01 00:00:00'),
(12, 55, 13, 800, '2020-08-01 00:00:00'),
(13, 56, 14, 800, '2020-08-01 00:00:00'),
(16, 57, 29, 200, '2020-09-01 00:00:00'),
(17, 58, 30, 200, '2020-09-01 00:00:00'),
(18, 59, 34, 200, '2020-09-01 00:00:00'),
(19, 60, 42, 500, '2020-10-01 00:00:00'),
(1, 61, 1, 0, '2020-10-01 00:00:00'),
(2, 62, 22, 100, '2020-10-01 00:00:00'),
(3, 63, 23, 100, '2020-10-01 00:00:00'),
(4, 64, 39, 100, '2020-10-01 00:00:00'),
(5, 65, 6, 100, '2020-10-01 00:00:00'),
(6, 66, 38, 500, '2020-10-01 00:00:00'),
(7, 67, 35, 500, '2020-10-01 00:00:00'),
(1, 68, 2, 500, '2020-10-01 00:00:00'),
(9, 69, 10, 500, '2020-10-01 00:00:00'),
(10, 70, 11, 0, '2020-10-01 00:00:00'),
(11, 71, 31, 100, '2020-10-01 00:00:00'),
(12, 72, 13, 800, '2020-10-01 00:00:00'),
(13, 73, 14, 800, '2020-10-01 00:00:00'),
(16, 74, 29, 200, '2020-12-01 00:00:00'),
(17, 75, 30, 200, '2020-12-01 00:00:00'),
(18, 76, 34, 200, '2020-12-01 00:00:00'),
(19, 77, 42, 500, '2021-01-01 00:00:00'),
(1, 78, 1, 0, '2021-02-01 00:00:00'),
(2, 79, 22, 100, '2021-02-01 00:00:00'),
(3, 80, 23, 100, '2021-02-01 00:00:00'),
(4, 81, 39, 100, '2021-02-01 00:00:00'),
(5, 82, 6, 100, '2021-02-01 00:00:00'),
(6, 83, 38, 500, '2021-02-01 00:00:00'),
(7, 84, 35, 500, '2021-02-01 00:00:00'),
(1, 85, 2, 500, '2021-02-01 00:00:00'),
(9, 86, 10, 500, '2021-02-01 00:00:00'),
(10, 87, 11, 0, '2021-02-01 00:00:00'),
(11, 88, 31, 100, '2021-02-01 00:00:00'),
(12, 89, 13, 800, '2021-02-01 00:00:00'),
(13, 90, 14, 800, '2021-02-01 00:00:00'),
(17, 91, 30, 200, '2021-03-01 00:00:00'),
(18, 92, 34, 200, '2021-03-01 00:00:00'),
(19, 93, 42, 500, '2021-03-01 00:00:00');

