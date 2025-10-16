const { Op } = require("sequelize")
const Usuario = require("../models/Usuario")

// GET /usuarios (lista)
getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      order: [["id_usuario", "DESC"]],
    })
    res.json(usuarios)
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" })
  }
}

module.exports = {
  getAllUsuarios,
}

