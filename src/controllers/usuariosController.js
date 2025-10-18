const { Op } = require("sequelize")
const Usuario = require("../models/Usuario")
const chalk = require("chalk")
const bcrypt = require("bcrypt")
process.loadEnvFile()

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

// POST /usuarios (crear)
crearUsuario = async (req, res) => {
  try {
    const {
      nyap,
      email,
      password,
      fecha_nac,
      sexo,
      cp,
      id_pais,
      tipo_usuario_actual,
    } = req.body

    // Validar si falta algún campo
    const camposRequeridos = [
      "nyap",
      "email",
      "password",
      "fecha_nac",
      "sexo",
      "cp",
      "id_pais",
      "tipo_usuario_actual",
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

    // Validar si el email ya existe
    const emailExiste = await Usuario.findOne({where: { email }})
    if (emailExiste) {
      res.status(400).json({ error: "El email ya está registrado" })
      console.log(chalk.red(`Email existente`))
      return
    }

    // Hash de contraseña
    const hashPassword = await bcrypt.hash(password, +process.env.SALT_ROUNDS)

    // Crear usuario
    const usuario = await Usuario.create({
      nyap,
      email,
      password_hash: hashPassword,
      fecha_nac,
      sexo,
      cp,
      id_pais,
      tipo_usuario_actual,
    })

    // res status message 
    res.status(201).json({ message: "Usuario creado correctamente", usuario })
    console.log(chalk.green(`Usuario creado correctamente`))
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor: " + error })
    console.log(chalk.red(`Error en el servidor: ${error}`))
  }
}

// PUT /usuarios/:id (actualizar)
updateUsuario = async (req, res) => {
  // Implementación pendiente
}


// DELETE /usuarios/:id (eliminar) 
deleteUsuario = async (req, res) => {
  const { id } = req.params
  try {
    const usuario = await Usuario.findByPk(id)
    if (!usuario) {
      res.status(404).json({ message: "No se encontró el usuario" })
      console.log(chalk.yellow("No se encontró el usuario"))
      return
    }

    const nyap = usuario.nyap

    await usuario.destroy()
    res.status(200).json({ message: `Usuario ${nyap} eliminado correctamente` })
    console.log(chalk.green(`Usuario ${nyap} eliminado correctamente`))
  } catch (error) { 
    res.status(500).json({ error: "Error en el servidor: " + error })
    console.log(chalk.red(`Error en el servidor: ${error}`))
  }
}

// GET /usuarios/password-vencidas 
getUsuariosPasswordVencidas = async (req, res) => {
  // Implementación pendiente
}

module.exports = {
  getAllUsuarios,
  getUsuarioByID,
  crearUsuario,
  updateUsuario,
  deleteUsuario,
  getUsuariosPasswordVencidas
}
 