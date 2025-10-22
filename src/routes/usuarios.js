const express = require("express")
const router = express.Router()
const usuariosController = require("../controllers/usuariosController")

// Ruta para obtener usuarios con password vencidas
router.get("/password-vencidas", usuariosController.getUsuariosPasswordVencidas)

// Ruta para listar usuarios
router.get("/", usuariosController.getAllUsuarios)

// Ruta para obtener un usuario por ID
router.get("/:id", usuariosController.getUsuarioByID)

// Ruta para crear un usuario
router.post("/", usuariosController.crearUsuario)

// Ruta para actualizar un usuario
router.put("/:id", usuariosController.updateUsuario)

// Ruta para eliminar un usuario
router.delete("/:id", usuariosController.deleteUsuario)



module.exports = router
