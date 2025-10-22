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

    // --- Validar si hay usuarios ---
    if (usuarios.length === 0) {
      res.status(404).json({ message: "No se encontraron usuarios" })
      console.log(chalk.yellow("No se encontraron usuarios"))
      return
    }

    // --- Devolver resultados ---
    console.log(chalk.green(`Usuarios obtenidos correctamente`))
    res.json(usuarios)
  } catch (error) {
    return next(error)
  }
}

// GET /usuarios/:id (detalle)
getUsuarioByID = async (req, res) => {
  const { id } = req.params
  try {
    const usuario = await Usuario.findByPk(id)

    // --- Validar que el usuario exista ---
    if (!usuario) {
      res.status(404).json({ message: "No se encontró el usuario" })
      console.log(chalk.yellow("No se encontró el usuario"))
      return
    }
    console.log(chalk.green(`Usuario obtenido correctamente`))
    return res.status(200).json(usuario)
  } catch (error) {
    return next(error)
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
      fecha_ult_mod_password = new Date(),
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

    res.status(201).json({ message: "Usuario creado correctamente", usuario })
    console.log(chalk.green(`Usuario creado correctamente`))
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor: " + error })
    console.log(chalk.red(`Error en el servidor: ${error}`))
  }
}

// PUT /usuarios/:id (actualizar)
updateUsuario = async (req, res) => {
   try {
    const { id } = req.params
    const { nyap, email, fecha_nac, sexo, cp, id_pais, tipo_usuario_actual } = req.body

    // --- Validar que el usuario exista ---
    const usuario = await Usuario.findByPk(id)
    if (!usuario) {
      console.log(chalk.yellow(`Usuario con id ${id} no encontrado`))
      return res.status(404).json({ error: "Usuario no encontrado" })
    }

    // --- Si se actualiza el email, verificar que no esté en uso por otro usuario ---
    if (email && email !== usuario.email) {
      const emailExiste = await Usuario.findOne({ 
        where: { 
          email,
          id_usuario: { [Op.ne]: id } // Excluir el usuario actual
        } 
      })
      if (emailExiste) {
        console.log(chalk.yellow(`Email ${email} ya está en uso`))
        return res.status(409).json({ error: "El email ya está registrado" })
      }
    }

    // --- Actualizar el usuario ---
    await usuario.update({
      nyap,
      email,
      fecha_nac,
      sexo,
      cp,
      id_pais,
      tipo_usuario_actual
    })

    // --- Devolver resultados ---
    console.log(chalk.green(`Usuario ${id} actualizado correctamente`))
    res.status(200).json({
      message: "Usuario actualizado correctamente",
      usuario: usuarioActualizado
    })

  } catch (error) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ error: "País o tipo de usuario inválido" })
    }
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: "Datos inválidos: " + error.message })
    }
    return next(error)
  }
}


// DELETE /usuarios/:id (eliminar) 
deleteUsuario = async (req, res) => {
  const { id } = req.params
  try {
    const usuario = await Usuario.findByPk(id)

    // --- Validar que el usuario exista ---
    if (!usuario) {
      console.log(chalk.yellow("No se encontró el usuario"))
      return res.status(404).json({ message: "No se encontró el usuario" })
    }

    // --- Eliminar el usuario ---
    const nyap = usuario.nyap
    await usuario.destroy()

    // --- Devolver resultados ---
    console.log(chalk.green(`Usuario ${nyap} eliminado correctamente`))
    return res.status(200).json({ message: `Usuario ${nyap} eliminado correctamente` })
  } catch (error) { 
    return next(error)
  }
}

// GET /usuarios/password-vencidas 
getUsuariosPasswordVencidas = async (req, res) => {
  try {
    const { dias = 90 } = req.query 
    
    // --- Calcular la fecha límite ---
    const fechaLimite = new Date()
    fechaLimite.setDate(fechaLimite.getDate() - parseInt(dias))

    // Buscar usuarios cuya última modificación de password sea anterior a la fecha límite
    // O que nunca la hayan modificado 
    const usuarios = await Usuario.findAll({
      where: {
        [Op.or]: [
          { fecha_ult_mod_password: { [Op.lt]: fechaLimite } },
          { fecha_ult_mod_password: null }
        ]
      },
      attributes: ['id_usuario', 'nyap', 'email', 'fecha_ult_mod_password'],
      order: [['fecha_ult_mod_password', 'ASC']]
    })

    if (usuarios.length === 0) {
      console.log(chalk.green("No hay usuarios con contraseñas vencidas"))
      return res.status(200).json({ 
        message: "No hay usuarios con contraseñas vencidas",
        total: 0,
        usuarios: []
      })
    }

    // --- Devolver resultados ---
    console.log(chalk.yellow(`${usuarios.length} usuarios con contraseñas vencidas`))
    res.status(200).json({
      message: `Usuarios con contraseñas vencidas (más de ${dias} días)`,
      total: usuarios.length,
      dias_limite: parseInt(dias),
      usuarios
    })
    

  } catch (error) {
    return next(error)
  }
}

module.exports = {
  getAllUsuarios,
  getUsuarioByID,
  crearUsuario,
  updateUsuario,
  deleteUsuario,
  getUsuariosPasswordVencidas
}
 