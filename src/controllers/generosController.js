const Genero = require("../models/Genero")
const chalk = require("chalk")

// GET /generos (lista)
getAllGeneros = async (req, res, next) => {
  try {
    const generos = await Genero.findAll({
      order: [["id_genero", "ASC"]]
    })

    // --- Validar si hay géneros ---
    if (generos.length === 0) {
      console.log(chalk.yellow("No se encontraron géneros"))
      return res.status(404).json({ message: "No se encontraron géneros" })
    }

    // --- Devolver resultados ---
    console.log(chalk.green(`Géneros obtenidos: ${generos.length}`))
    return res.status(200).json({
      total: generos.length,
      generos
    })

  } catch (error) {
    next(error)
  }
}

// POST /generos 
crearGenero = async (req, res, next) => {
  try {
    const { nombre } = req.body

    // --- Validar si falta campo nombre ---
    if (!nombre) {
      console.log(chalk.yellow("Falta el nombre del género"))
      return res.status(400).json({ error: "El campo nombre es requerido" })
    }

    // --- Validar que el nombre no exista ---
    const generoExiste = await Genero.findOne({ 
      where: { nombre: nombre.trim() } 
    })

    if (generoExiste) {
      console.log(chalk.yellow(`Género "${nombre}" ya existe`))
      return res.status(409).json({ error: "Este género ya existe" })
    }

    const genero = await Genero.create({
      nombre: nombre.trim()
    })

    // --- Devolver resultados ---
    console.log(chalk.green(`Género "${nombre}" creado`))
    return res.status(201).json({
      message: "Género creado correctamente",
      genero
    })

  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: "Este género ya existe" })
    }
    return next(error)
  }
}

module.exports = { getAllGeneros, crearGenero }