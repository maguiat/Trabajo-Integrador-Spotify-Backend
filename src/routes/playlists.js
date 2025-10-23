
const express = require("express");
const router = express.Router();
const playlistController = require("../controllers/playlistsController")

// Ruta para listar playlists
router.get("/", playlistController.getPlaylists)

// Ruta para obtener una playlist por ID
router.get("/:id", playlistController.getPlaylistByID)

// Ruta para crear una nueva playlist
router.post("/", playlistController.crearPlaylist)

// Ruta para actualizar una playlist
router.put("/:id", playlistController.updatePlaylist)

// Ruta para agregar canción a una playlist
router.post("/:id/canciones", playlistController.agregarCancionAPlayList)

// Ruta para eliminar canción de una playlist
router.delete("/:id/canciones/:id_cancion", playlistController.eliminarCancionDePlaylist)

module.exports = router
