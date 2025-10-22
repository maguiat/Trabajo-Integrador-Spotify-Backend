const Album = require("../models/Album")
const chalk = require("chalk")
const { Op } = require("sequelize")

// GET /albumes (lista)
getAlbumes = async (req, res) => {
  try {
    const { artistaId, query } = req.query 
    const where = {}

    // --- Filtrar por artista y coincidencia parcial ---
    if (artistaId) {where.id_artista = artistaId}
    if (query) {where.nombre = { [Op.like]: `%${ query }%` }}

    const albumes = await Album.findAll({
      where,
      order: [["id_album", "DESC"]],
    })

    // --- Validar si hay álbumes ---
    if (albumes.length === 0) {
      console.log(chalk.yellow("No se encontraron álbumes"))
      return res.status(404).json({ message: "No se encontraron álbumes" })
    }

    // --- Devolver resultados ---
    console.log(chalk.green(`Álbumes obtenidos correctamente`))
    return res.status(200).json(albumes)
  } catch (error) {
    return next(error)
  }
}

// GET /albumes/:id (detalle)
getAlbumByID = async (req, res) => {
  const { id } = req.params
  try {
    const album = await Album.findByPk(id)

    // --- Validar que el álbum exista ---
    if (!album) {
      console.log(chalk.yellow("No se encontró el álbum"))
      return res.status(404).json({ message: "No se encontró el álbum" })
    }

    // --- Devolver resultados ---
    console.log(chalk.green(`Álbum obtenido correctamente`))
    return res.status(200).json(album)
  } catch (error) {
    return next(error)
  }
}

// GET /albumes/:id/canciones (lista de canciones)
getAlbumByIDCanciones = async (req, res) => {
  const { id } = req.params
  try {
    const canciones = await Album.findAll({
      where: {
        id_album: id
      }
    })
    // --- Validar si hay canciones ---
    if (!canciones) {
      console.log(chalk.yellow("No se encontraron canciones"))
      return res.status(404).json({ message: "No se encontraron canciones" })
    }

    // --- Devolver resultados ---
    console.log(chalk.green(`Canciones obtenidas correctamente`))
    return res.status(200).json(canciones)
  } catch (error) {
    return next(error)
  }
}

// POST /albumes (crear)
crearAlbum = async (req, res) => {
  try {
    const {
      titulo,
      id_artista,
      id_discografica,
      anio_publicacion,
      duracion_total_seg,
    } = req.body

    // --- Validar si falta algún campo ---
    const camposRequeridos = [
      "titulo",
      "id_artista",
      "id_discografica",
      "anio_publicacion",
    ]
     // --- Filtrar campos faltantes ---
    const camposFaltantes = camposRequeridos.filter(
      (campo) => !req.body[campo]
    )

    // --- Validar si faltan campos ---
    if (camposFaltantes.length > 0) {
      console.log(chalk.red(`Faltan campos requeridos: ${camposFaltantes}`))
      return res.status(400).json({ error: "Faltan campos requeridos: " + camposFaltantes })
    }

    // --- Crear álbum ---
    const album = await Album.create({
      titulo,
      id_artista,
      id_discografica,
      anio_publicacion,
      duracion_total_seg,
    })

    // --- Devolver resultados ---
    console.log(chalk.green(`Álbum creado correctamente`))
    return res.status(201).json({ message: "Álbum creado correctamente", album })
  } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({ error: "Ya existe un álbum con ese titulo para este artista" })
        console.log(chalk.red(`Título existente para este artista`))
        return
      }
      return next(error)
  }
}

module.exports = {
  getAlbumes,
  getAlbumByID,
  getAlbumByIDCanciones,
  crearAlbum,
}