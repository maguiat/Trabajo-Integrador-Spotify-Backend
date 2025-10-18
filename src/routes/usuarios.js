const express = require("express")
const router = express.Router()
const usuariosController = require("../controllers/usuariosController")

// Ruta para listar usuarios
router.get("/", usuariosController.getAllUsuarios)
router.get("/:id", usuariosController.getUsuarioByID)
router.post("/", usuariosController.crearUsuario)
router.put("/:id", usuariosController.updateUsuario)
router.delete("/:id", usuariosController.deleteUsuario)
router.get("/password-vencidas", usuariosController.getUsuariosPasswordVencidas)

module.exports = router
