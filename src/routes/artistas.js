const express = require("express")
const router = express.Router()
const artistasController = require("../controllers/artistasController")

// Ruta para listar artistas
router.get("/", artistasController.getAllArtistas)

// Ruta para obtener un artista por ID
router.get("/:id", artistasController.getArtistaByID)

module.exports = router
