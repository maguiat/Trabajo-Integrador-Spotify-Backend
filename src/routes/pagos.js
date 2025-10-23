const express = require("express")
const router = express.Router()
const pagosController = require("../controllers/pagosController")

// Obtener pagos de un usuario
router.get("/", pagosController.getPagos)

// Crear pago
router.post("/", pagosController.crearPago)

module.exports = router
