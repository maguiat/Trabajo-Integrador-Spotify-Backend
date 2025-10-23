const MetodoPago = require("../models/MetodoPago")
const Usuario = require("../models/Usuario")
const chalk = require("chalk")

// GET /metodos-pago?usuarioId=
getMetodosPago = async (req, res, next) => {
  try {
    const { usuarioId } = req.query
    if (!usuarioId) {
      return res
        .status(400)
        .json({ error: "El parámetro usuarioId es obligatorio." })
    }

    // --- Validar que el usuario exista ---
    const usuario = await Usuario.findByPk(usuarioId)
    if (!usuario) {
      console.log(chalk.yellow(`Usuario con id ${usuarioId} no encontrado`))
      return res.status(404).json({ error: "Usuario no encontrado" })
    }

    // --- Obtener métodos de pago del usuario ---
    const metodosPago = await MetodoPago.findAll({
      where: { id_usuario: usuarioId },
      order: [["id_metodo_pago", "ASC"]],
    })

    // --- Validar si hay métodos de pago ---
    if (metodosPago.length === 0) {
      console.log(chalk.yellow("No se encontraron métodos de pago"))
      return res
        .status(404)
        .json({ message: "No se encontraron métodos de pago" })
    }

    // --- Devolver resultados ---
    console.log(
      chalk.green(`Métodos de pago obtenidos: ${metodosPago.length}`)
    )
    return res.status(200).json({
      total: metodosPago.length,
      metodosPago,
    })
  } catch (error) {
    next(error)
  }
}

// POST /metodos-pago
crearMetodoPago = async (req, res, next) => {
  try {
    const {
      id_usuario,
      tipo_forma_pago,
      cbu,
      nro_tarjeta,
      mes_caduca,
      anio_caduca,
      banco_codigo,
    } = req.body

    // --- Validar campos requeridos ---
    const camposRequeridos = ["id_usuario", "tipo_forma_pago"]
    const camposFaltantes = camposRequeridos.filter(
      (campo) => !req.body[campo]
    )
    if (camposFaltantes.length > 0) {
      console.log(chalk.red(`Faltan campos requeridos: ${camposFaltantes}`))
      return res.status(400).json({
        error: "Faltan campos requeridos: " + camposFaltantes,
      })
    }

    // --- Validar que el usuario exista ---
    const usuario = await Usuario.findByPk(id_usuario)
    if (!usuario) {
      console.log(chalk.yellow(`Usuario con id ${id_usuario} no encontrado`))
      return res.status(404).json({ error: "Usuario no encontrado" })
    }

    // --- Validar tipo de forma de pago ---
    const tiposPagos = [
      "Credito",
      "Debito",
      "Efectivo",
      "Debito Automatico x Banco", 
    ]
    if (!tiposPagos.includes(tipo_forma_pago)) {
      console.log(chalk.yellow(`Tipo de forma de pago no válido`))
      return res.status(400).json({
        error: `Tipo de forma de pago debe ser: ${tiposPagos.join(", ")}`,
      })
    }

    // --- Variable para enmascarar ---
    let nro_tarjeta_enmascarado = 'N/A'

    // --- Validar según tipo ---
    if (tipo_forma_pago === "Credito" || tipo_forma_pago === "Debito") {
      if (!nro_tarjeta || !mes_caduca || !anio_caduca || !banco_codigo) {
        console.log(chalk.red("Faltan datos para tarjeta"))
        return res.status(400).json({ 
          error: "Faltan datos: nro_tarjeta, mes_caduca, anio_caduca, banco_codigo" 
        })
      }

      // Enmascarar tarjeta (solo últimos 4 dígitos)
      nro_tarjeta_enmascarado = nro_tarjeta.slice(-4)
    }

    if (tipo_forma_pago === "Debito Automatico x Banco") {
      if (!cbu || !banco_codigo) {
        console.log(chalk.red("Faltan datos para débito automático"))
        return res.status(400).json({ 
          error: "Faltan datos: cbu, banco_codigo" 
        })
      }
    }

    // --- Crear método de pago ---
    const metodoPago = await MetodoPago.create({
      id_usuario,
      tipo_forma_pago,
      cbu: cbu || null,
      banco_codigo: banco_codigo || 0,
      nro_tarjeta_masc: nro_tarjeta_enmascarado,
      mes_caduca: mes_caduca || 1,
      anio_caduca: anio_caduca || 2000,
    })

    console.log(chalk.green(`Método de pago creado correctamente`))
    return res.status(201).json({ 
      message: "Método de pago creado correctamente", 
      metodoPago 
    })

  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      console.log(chalk.red(`El método de pago ya existe`))
      return res.status(400).json({ 
        error: "El método de pago ya existe para ese usuario" 
      })
    }
    return next(error)
  }
}

module.exports = {
  getMetodosPago,
  crearMetodoPago,
}
