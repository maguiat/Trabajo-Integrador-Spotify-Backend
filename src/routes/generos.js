const express = require("express")
const router = express.Router()

const generosController = require("../controllers/generosController")
const { getAllGeneros, crearGenero } = generosController

// Ruta para listar géneros
router.get("/", getAllGeneros)

// Ruta para crear un género
router.post("/", crearGenero)

module.exports = router
