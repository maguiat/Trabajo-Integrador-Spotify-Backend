const express = require("express")
const router = express.Router()
const artistasController = require("../controllers/artistasController")

// Ruta para listar artistas
router.get("/", artistasController.getAllArtistas)

// Ruta para obtener un artista por ID
router.get("/:id", artistasController.getArtistaByID)

// Ruta para crear un nuevo artista
router.post("/", artistasController.crearArtista)

module.exports = router
