/**
 * Rutas para usuarios
 * Los estudiantes deben implementar todas las rutas relacionadas con usuarios
 */

const express = require("express")
const router = express.Router()
const usuariosController = require("../controllers/usuariosController")

// Ruta para listar usuarios
router.get("/", usuariosController.getAllUsuarios)
router.get("/:id", usuariosController.getUsuarioByID)

module.exports = router
