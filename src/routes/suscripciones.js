const express = require("express")
const router = express.Router()
const suscripcionesController = require("../controllers/suscripcionesController")


// Ruta para listar suscripciones
router.get("/", suscripcionesController.getSuscripciones)

// Ruta para obtener una suscripción por ID
router.get("/:id", suscripcionesController.getSuscripcionByID)

// Ruta para crear una nueva suscripción
router.post("/", suscripcionesController.crearSuscripcion)

module.exports = router