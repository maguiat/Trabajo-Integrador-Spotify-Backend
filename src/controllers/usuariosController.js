const { Op } = require("sequelize")
const Usuario = require("../models/Usuario")
const chalk = require("chalk")

// GET /usuarios (lista)
getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      order: [["id_usuario", "DESC"]],
    })
    if (usuarios.length === 0) {
      res.status(404).json({ message: "No se encontraron usuarios" })
      console.log(chalk.yellow("No se encontraron usuarios"))
      return
    }
    res.json(usuarios)
    console.log(chalk.green(`Usuarios obtenidos correctamente`))
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor: " + error })
    console.log(chalk.red(`Error en el servidor: ${error}`))
  }
}

// GET /usuarios/:id (detalle)
getUsuarioByID = async (req, res) => {
  const { id } = req.params
  try {
    const usuario = await Usuario.findByPk(id)
    if (!usuario) {
      res.status(404).json({ message: "No se encontró el usuario" })
      console.log(chalk.yellow("No se encontró el usuario"))
      return
    }
    res.json(usuario)
    console.log(chalk.green(`Usuario obtenido correctamente`))
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor: " + error })
    console.log(chalk.red(`Error en el servidor: ${error}`))
  }
}
  
module.exports = {
  getAllUsuarios,
  getUsuarioByID
}

