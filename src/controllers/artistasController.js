const Artista = require("../models/Artista")
const chalk = require("chalk")

// GET /artistas (lista)
getAllArtistas = async (req, res) => {
  try {
    const artistas = await Artista.findAll({
      order: [["id_artista", "DESC"]],
    })
    if (artistas.length === 0) {
      res.status(404).json({ message: "No se encontraron artistas" })
      console.log(chalk.yellow("No se encontraron artistas"))
      return
    }
    res.json(artistas)
    console.log(chalk.green(`Artistas obtenidos correctamente`))
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor: " + error })
    console.log(chalk.red(`Error en el servidor: ${error}`))
  }
}

// GET /artistas/:id (detalle)
getArtistaByID = async (req, res) => {
  const { id } = req.params
  try {
    const artista = await Artista.findByPk(id)
    if (!artista) {
      res.status(404).json({ message: "No se encontró el artista" })
      console.log(chalk.yellow("No se encontró el artista"))
      return
    }
    res.json(artista)
    console.log(chalk.green(`Artista obtenido correctamente`))
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor: " + error })
    console.log(chalk.red(`Error en el servidor: ${error}`))
  }
}

module.exports = {
    getAllArtistas,
    getArtistaByID
}