const Album = require("../models/Album")
const chalk = require("chalk")
const { Op } = require("sequelize")

// GET /albumes (lista)
getAllAlbumes = async (req, res) => {
  try {
    const { artistaId, query } = req.query 
    const where = {}

    if (artistaId) {
      where.id_artista = artistaId // filtra por artista
    }

    if (query) {
      where.nombre = { [Op.like]: `%${ query }%` } // filtra por coincidencia parcial
    }

    const albumes = await Album.findAll({
      where,
      order: [["id_album", "DESC"]],
    })

    if (albumes.length === 0) {
      res.status(404).json({ message: "No se encontraron álbumes" })
      console.log(chalk.yellow("No se encontraron álbumes"))
      return
    }

    res.json(albumes)
    console.log(chalk.green(`Álbumes obtenidos correctamente`))
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor: " + error })
    console.log(chalk.red(`Error en el servidor: ${error}`))
  }
}

// GET /albumes/:id (detalle)
getAlbumByID = async (req, res) => {
  const { id } = req.params
  try {
    const album = await Album.findByPk(id)
    if (!album) {
      res.status(404).json({ message: "No se encontró el álbum" })
      console.log(chalk.yellow("No se encontró el álbum"))
      return
    }
    res.json(album)
    console.log(chalk.green(`Álbum obtenido correctamente`))
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor: " + error })
    console.log(chalk.red(`Error en el servidor: ${error}`))
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
    if (!canciones) {
      res.status(404).json({ message: "No se encontró el álbum" })
      console.log(chalk.yellow("No se encontró el albume"))
      return
    }
    res.json(canciones)
    console.log(chalk.green(`Canciones obtenidas correctamente`))
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor: " + error })
    console.log(chalk.red(`Error en el servidor: ${error}`))
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

    // Validar si falta algún campo
    const camposRequeridos = [
      "titulo",
      "id_artista",
      "id_discografica",
      "anio_publicacion",
    ]
     // Filtrar campos faltantes
    const camposFaltantes = camposRequeridos.filter(
      (campo) => !req.body[campo]
    )

    if (camposFaltantes.length > 0) {
      res
        .status(400)
        .json({
          error: "[ERROR] Faltan campos requeridos: " + camposFaltantes,
        })
      console.log(chalk.red(`Faltan campos requeridos: ${camposFaltantes}`))
      return
    }

    // Crear álbum
    const album = await Album.create({
      titulo,
      id_artista,
      id_discografica,
      anio_publicacion,
      duracion_total_seg,
    })

    res.status(201).json({ message: "Álbum creado correctamente", album })
    console.log(chalk.green(`Álbum creado correctamente`))
  } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({ error: "[ERROR]: Ya existe un álbum con ese titulo para este artista" })
        console.log(chalk.red(`Título existente para este artista`))
        return
      }
    res.status(500).json({ error: "Error en el servidor: " + error })
    console.log(chalk.red(`Error en el servidor: ${error}`))
  }
}

module.exports = {
  getAllAlbumes,
  getAlbumByID,
  getAlbumByIDCanciones,
  crearAlbum,
}