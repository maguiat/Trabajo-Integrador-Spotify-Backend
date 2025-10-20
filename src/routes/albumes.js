
const express = require("express")
const router = express.Router()
const albumesController = require("../controllers/albumesController")

// Ruta para listar albumes
router.get("/", albumesController.getAllAlbumes)

// Ruta para obtener un albume por ID
router.get("/:id", albumesController.getAlbumByID)

// Ruta para obtener canciones de un album
router.get("/:id/canciones", albumesController.getAlbumByIDCanciones)

// Ruta para crear un nuevo album
router.post("/", albumesController.crearAlbum)

module.exports = router