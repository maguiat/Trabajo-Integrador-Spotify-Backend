const Artista = require("../models/Artista")
const chalk = require("chalk")

// GET /artistas (lista)
getAllArtistas = async (req, res) => {
  try {
    const artistas = await Artista.findAll({
      order: [["id_artista", "DESC"]],
    })

    // --- Validar si hay artistas ---
    if (artistas.length === 0) {
      console.log(chalk.yellow("No se encontraron artistas"))
      return res.status(404).json({ message: "No se encontraron artistas" })
    }

    // --- Devolver resultados ---
    console.log(chalk.green(`Artistas obtenidos correctamente`))
    return res.status(200).json(artistas)
  } catch (error) {
    return next(error)
  }
}

// GET /artistas/:id (detalle)
getArtistaByID = async (req, res) => {
  const { id } = req.params
  try {
    const artista = await Artista.findByPk(id)

    // --- Validar que el artista exista ---
    if (!artista) {
      console.log(chalk.yellow("No se encontró el artista"))
      return res.status(404).json({ message: "No se encontró el artista" })
    }
    
    // --- Devolver resultados ---
    console.log(chalk.green(`Artista obtenido correctamente`))
    return res.status(200).json(artista)
  } catch (error) {
    return next(error)
  }
}

// POST /artistas (crear)
crearArtista = async (req, res) => {
  try {
    const {
      nombre,
      imagen_url,
    } = req.body

    // --- Validar si el nombre ya existe ---
    const nombreExiste = await Artista.findOne({where: { nombre }})
    if (nombreExiste) {
      console.log(chalk.red(`Nombre existente`))
      return res.status(400).json({ error: "El nombre ya está registrado" })
    }

    // --- Crear artista ---
    const artista = await Artista.create({
      nombre,
      imagen_url,
    })

    // --- Devolver resultados ---
    console.log(chalk.green(`Artista creado correctamente`))
    return res.status(201).json({ message: "Artista creado correctamente", artista })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
    getAllArtistas,
    getArtistaByID,
    crearArtista,
}