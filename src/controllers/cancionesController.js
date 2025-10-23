const { Op } = require("sequelize")
const chalk = require("chalk")

const Cancion = require("../models/Cancion")
const Album = require("../models/Album")
const CancionGenero = require("../models/Cancion_genero")
const Genero = require("../models/Genero")

// GET /canciones (listar canciones con filtros opcionales)
getCanciones = async (req, res, next) => {
  try {
    const { genero, artistaId, albumId } = req.query
    let cancionesIds = null
    let albumesIds = null

    // --- Filtro por género ---
    if (genero) {
      const cancionesConGenero = await CancionGenero.findAll({
        where: { id_genero: genero },
        attributes: ["id_cancion"],
      })

      if (cancionesConGenero.length === 0) {
        console.log(chalk.yellow("No se encontraron canciones con ese género"))
        return res
          .status(404)
          .json({ message: "No se encontraron canciones con ese género" })
      }

      cancionesIds = cancionesConGenero.map((c) => c.id_cancion)
    }

    // --- Filtro por artista ---
    if (artistaId) {
      const albumesDelArtista = await Album.findAll({
        where: { id_artista: artistaId },
        attributes: ["id_album"],
      })

      if (albumesDelArtista.length === 0) {
        console.log(chalk.yellow("No se encontraron álbumes de ese artista"))
        return res
          .status(404)
          .json({ message: "No se encontraron álbumes de ese artista" })
      }

      albumesIds = albumesDelArtista.map((a) => a.id_album)
    }

    // ---
    const where = {}
    if (cancionesIds) where.id_cancion = { [Op.in]: cancionesIds } // Si filtró por artista, limitar a álbumes de ese artista
    if (albumesIds) where.id_album = { [Op.in]: albumesIds } // Si filtró directamente por álbum
    if (albumId) where.id_album = albumId // Búsqueda con todos los filtros

    // Búsqueda con todos los filtros
    const canciones = await Cancion.findAll({
      where,
      order: [["id_cancion", "DESC"]],
    })

    if (canciones.length === 0) {
      console.log(chalk.yellow("No se encontraron canciones"))
      return res.status(404).json({ message: "No se encontraron canciones" })
    }

    // Devolver resultados
    console.log(
      chalk.green(`Canciones obtenidas: ${canciones.length} resultados`)
    )
    return res.status(200).json({ total: canciones.length, canciones })
  } catch (error) {
    return next(error)
  }
}

// GET /canciones/:id
getCancionByID = async (req, res, next) => {
  const { id } = req.params
  try {
    const cancion = await Cancion.findByPk(id)
    if (!cancion) {
      console.log(chalk.yellow("No se encontró la canción"))
      return res.status(404).json({ message: "No se encontró la canción" })
    }

    console.log(chalk.green(`Canción obtenida correctamente`))
    return res.status(200).json(cancion)
  } catch (error) {
    return next(error)
  }
}

// POST /canciones (crear canción)
crearCancion = async (req, res, next) => {
  try {
    const { titulo, duracion_seg, id_album, reproducciones, likes } = req.body

    // --- Validar si falta algún campo ---
    const camposRequeridos = ["titulo", "duracion_seg", "id_album"]
    
    const camposFaltantes = camposRequeridos.filter(
      (campo) => !req.body[campo]
    )

    if (camposFaltantes.length > 0) {
      console.log(chalk.red(`Faltan campos requeridos: ${camposFaltantes}`))
      return res.status(400).json({
        error: "Faltan campos requeridos: " + camposFaltantes,
      })
    }

    // --- Validar duración_seg > 0 ---
    if (!Number.isInteger(duracion_seg) || duracion_seg <= 0) {
      console.log(chalk.red(`Duración inválida`))
      return res.status(400).json({
        error:
          "Duración debe ser un número mayor que 0 y debe estar en segundos. ",
      })
    }

    // --- Validar que el álbum exista ---
    const album = await Album.findByPk(id_album)
    if (!album) {
      console.log(chalk.yellow("No se encontró el álbum"))
      return res.status(404).json({ message: "No se encontró el álbum" })
    }

    // Crear canción
    const cancion = await Cancion.create({
      titulo,
      duracion_seg,
      id_album,
      reproducciones,
      likes,
    })

    console.log(chalk.green(`Canción creada correctamente`))
    res.status(201).json({ message: "Canción creada correctamente", cancion })
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      console.log(chalk.red(`Título existente para ese álbum`))
      return res.status(400).json({
        error: "Ya existe una canción con ese titulo para ese álbum",
      })
    }
    return next(error)
  }
}

// PUT /canciones/:id (actualizar)
updateCancion = async (req, res, next) => {
  try {
    const { id } = req.params
    const { titulo, duracion_seg, id_album, reproducciones, likes } = req.body

    // --- Validar que la canción existe ---
    const cancion = await Cancion.findByPk(id)
    if (!cancion) {
      console.log(chalk.yellow(`Canción con id ${id} no encontrada`))
      return res.status(404).json({ error: "Canción no encontrada" })
    }

    // --- Actualizar la canción ---
    await cancion.update({
      titulo,
      duracion_seg,
      id_album,
      reproducciones,
      likes,
    })

    // --- Obtener la canción actualizada ---
    const cancionActualizada = await Cancion.findByPk(id)

    // --- Devolver resultados ---
    console.log(chalk.green(`Canción ${id} actualizada correctamente`))
    return res.status(200).json({
      message: "Canción actualizada correctamente",
      cancion: cancionActualizada,
    })
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({ error: "Álbum inválido" })
    }
    if (error.name === "SequelizeValidationError") {
      return res
        .status(400)
        .json({ error: "Datos inválidos: " + error.message })
    }
    return next(error)
  }
}

// POST /canciones/:id/generos { id_genero } (asocia genero a canción)
asociarGenero = async (req, res, next) => {
  try {
    const { id } = req.params
    const { id_genero } = req.body

    // --- Validar que se envió id_genero ---
    if (!id_genero) {
      console.log(chalk.yellow("Falta id_genero en el body"))
      return res.status(400).json({ error: "El campo id_genero es requerido" })
    }

    // --- Validar que la canción exista ---
    const cancion = await Cancion.findByPk(id)
    if (!cancion) {
      console.log(chalk.yellow(`Canción con id ${id} no encontrada`))
      return res.status(404).json({ error: "Canción no encontrada" })
    }

    // --- Validar que el género exista ---
    const genero = await Genero.findByPk(id_genero)
    if (!genero) {
      console.log(chalk.yellow(`Género con id ${id_genero} no encontrado`))
      return res.status(404).json({ error: "Género no encontrado" })
    }

    // --- Validar si la asociación ya existe ---
    const asociacionExistente = await CancionGenero.findOne({
      where: {
        id_cancion: id,
        id_genero: id_genero,
      },
    })
    if (asociacionExistente) {
      console.log(
        chalk.yellow(`La canción ${id} ya tiene el género ${id_genero}`)
      )
      return res.status(409).json({
        error: "Esta canción ya tiene asociado ese género",
      })
    }

    // --- Crear la asociación ---
    await CancionGenero.create({
      id_cancion: id,
      id_genero: id_genero,
    })

    console.log(chalk.green(`Género ${genero.nombre} asociado a canción ${cancion.titulo}`))
    return res.status(201).json({
      message: "Género asociado correctamente a la canción",
      cancion: {
        id_cancion: cancion.id_cancion,
        titulo: cancion.titulo,
      },
      genero: {
        id_genero: genero.id_genero,
        nombre: genero.nombre,
      },
    })
  } catch (error) {
    return next(error)
  }
}

// DELETE /canciones/:id/generos/:id_genero (eliminar asociación)
eliminarGenero = async (req, res, next) => {
  try {
    const { id, id_genero } = req.params

    // --- Validar que la canción exista ---
    const cancion = await Cancion.findByPk(id)
    if (!cancion) {
      console.log(chalk.yellow(`Canción con id ${id} no encontrada`))
      return res.status(404).json({ error: "Canción no encontrada" })
    }

    // --- Validar que el género exista ---
    const genero = await Genero.findByPk(id_genero)
    if (!genero) {
      console.log(chalk.yellow(`Género con id ${id_genero} no encontrado`))
      return res.status(404).json({ error: "Género no encontrado" })
    }

    // --- Buscar la asociación ---
    const asociacion = await CancionGenero.findOne({
      where: {
        id_cancion: id,
        id_genero: id_genero,
      },
    })
    if (!asociacion) {
      console.log(chalk.yellow(`La canción ${id} no tiene asociado el género ${id_genero}`))
      return res.status(404).json({error: "Esta canción no tiene asociado ese género",})
    }

    // --- Eliminar la asociación ---
    await asociacion.destroy()

    console.log(chalk.green(`Género ${genero.nombre} eliminado de canción ${cancion.titulo}`))
    res.status(200).json({
      message: "Género desasociado correctamente de la canción",
      cancion: {
        id_cancion: cancion.id_cancion,
        titulo: cancion.titulo,
      },
      genero: {
        id_genero: genero.id_genero,
        nombre: genero.nombre,
      },
    })

  } catch (error) {
    return next(error)
  }
}

module.exports = {
  getCanciones,
  getCancionByID,
  crearCancion,
  updateCancion,
  asociarGenero,
  eliminarGenero,
}
