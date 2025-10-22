const express = require("express")
const router = express.Router()
const cancionesController = require("../controllers/cancionesController")

// Ruta para listar canciones
router.get("/", cancionesController.getCanciones)

// Ruta para obtener una cancion por ID
router.get("/:id", cancionesController.getCancionByID)

// Ruta para crear una nueva cancion
router.post("/", cancionesController.crearCancion)

// Ruta para actualizar una cancion
router.put("/:id", cancionesController.updateCancion)

// Ruta para asociar género a una canción
router.post("/:id/generos", cancionesController.asociarGenero)

// Ruta para eliminar género de una canción
router.delete("/:id/generos/:id_genero", cancionesController.eliminarGenero)

module.exports = router


