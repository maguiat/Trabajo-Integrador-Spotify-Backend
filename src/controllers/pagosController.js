const { Op } = require("sequelize")
const Pago = require("../models/Pago")
const Usuario = require("../models/Usuario")
const Suscripcion = require("../models/Suscripcion")
const MetodoPago = require("../models/MetodoPago")
const chalk = require("chalk")

// GET /pagos?usuarioId=&desde=&hasta=
getPagos = async (req, res, next) => {
    try {
        const { usuarioId, desde, hasta } = req.query
        if (!usuarioId) {
            console.log(chalk.red("Falta el parámetro usuarioId"))
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

        // --- Construir filtro de fechas ---
        const where = { id_usuario: usuarioId }
        if (desde || hasta) {
            where.fecha_pago = {}
            if (desde) {
                where.fecha_pago[Op.gte] = new Date(desde)
            }
            if (hasta) {
                where.fecha_pago[Op.lte] = new Date(hasta)
            }
        }

        // --- Obtener pagos del usuario ---
        const pagos = await Pago.findAll({
            where,
            order: [["id_pago", "ASC"]],
        })

        // --- Validar si hay pagos ---
        if (pagos.length === 0) {
            console.log(chalk.yellow("No se encontraron pagos"))
            return res
                .status(404)
                .json({ message: "No se encontraron pagos" })
        }

        // --- Devolver resultados ---
        console.log(chalk.green(`Pagos obtenidos: ${pagos.length}`))
        return res.status(200).json({
            total: pagos.length,
            pagos,
        })

    } catch (error) {
        next(error)
    }
}

// POST /pagos 
crearPago = async (req, res, next) => {
    try {
        const { usuarioId } = req.query
        const { id_suscripcion, id_metodo_pago, importe } = req.body

       // --- Validar si falta el parámetro usuarioId --- 
       if (!usuarioId) {
            console.log(chalk.red("Falta el parámetro usuarioId"))
            return res
                .status(400)
                .json({ error: "El parámetro usuarioId es obligatorio." })
        }
        
        // --- Validar si falta algún campo ---
        const camposRequeridos = ["id_suscripcion", "id_metodo_pago", "importe"]
        const camposFaltantes = camposRequeridos.filter(
            (campo) => !req.body[campo]
        )

        if (camposFaltantes.length > 0) {
            console.log(chalk.red(`Faltan campos requeridos: ${camposFaltantes}`))
            return res.status(400).json({
                error: "Faltan campos requeridos: " + camposFaltantes.join(", "),
            })
        }

        // --- Validar que el usuario exista ---
        const usuario = await Usuario.findByPk(usuarioId)
        if (!usuario) {
            console.log(chalk.yellow(`Usuario con id ${usuarioId} no encontrado`))
            return res.status(404).json({ error: "Usuario no encontrado" })
        }

        // --- Validar que el suscripcion exista ---
        const suscripcion = await Suscripcion.findByPk(id_suscripcion)
        if (!suscripcion) {
            console.log(chalk.yellow(`Suscripcion con id ${id_suscripcion} no encontrado`))
            return res.status(404).json({ error: "Suscripcion no encontrado" })
        }

        // --- Validar que el método de pago exista ---
        const metodoPago = await MetodoPago.findByPk(id_metodo_pago)
        if (!metodoPago) {
            console.log(chalk.yellow(`Método de pago con id ${id_metodo_pago} no encontrado`))
            return res.status(404).json({ error: "Método de pago no encontrado" })
        }

        // --- Validar importe ---
        if (importe < 0) {
            console.log(chalk.red(`El importe debe ser positivo`))
            return res.status(400).json({ error: "El importe debe ser positivo" })
        }

        // --- Crear pago ---
        const pago = await Pago.create({
            id_usuario: usuarioId,
            id_suscripcion,
            id_metodo_pago,
            importe,
            fecha_pago: new Date(),
        })

        console.log(chalk.green(`Pago creado correctamente`))
        return res.status(201).json({ 
            message: "Pago creado correctamente", 
            pago 
        })

    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            console.log(chalk.red(`El pago ya existe`))
            return res.status(400).json({ 
                error: "El pago ya existe para ese usuario" 
            })
        }
        return next(error)
    }   
}

module.exports = {
  getPagos,
  crearPago,
}