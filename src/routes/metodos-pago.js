const express = require("express")
const router = express.Router()
const metodosPagoController = require("../controllers/metodosPagoController")

// Obtener métodos de pago de un usuario
router.get("/", metodosPagoController.getMetodosPago)

// Crear método de pago
router.post("/", metodosPagoController.crearMetodoPago)

module.exports = router
