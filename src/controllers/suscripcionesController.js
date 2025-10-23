const Suscripcion = require("../models/Suscripcion")
const Usuario = require("../models/Usuario")
const TipoUsuario = require("../models/Tipo_Usuario")
const chalk = require("chalk")

// GET /suscripciones (listar suscripciones)
getSuscripciones = async (req, res, next) => {
    try {
        const suscripciones = await Suscripcion.findAll({
            order: [["id_suscripcion", "ASC"]],
        })

        // --- Validar si hay suscripciones ---
        if (suscripciones.length === 0) {
            console.log(chalk.yellow("No se encontraron suscripciones"))
            return res.status(404).json({ message: "No se encontraron suscripciones" })
        }

        // --- Devolver resultados ---
        console.log(chalk.green(`Suscripciones obtenidas: ${suscripciones.length}`))
        return res.status(200).json({
            total: suscripciones.length,
            suscripciones,
        })

    } catch (error) {
        next(error)
    }
}

// GET /suscripciones/:id (obtener suscripción por su ID)
getSuscripcionByID = async (req, res, next) => {
    const { id } = req.params
    try {
        const suscripcion = await Suscripcion.findByPk(id)
        if (!suscripcion) {
            console.log(chalk.yellow("No se encontró la suscripción"))
            return res.status(404).json({ message: "No se encontró la suscripción" })
        }

        console.log(chalk.green(`Suscripción obtenida correctamente`))
        return res.status(200).json(suscripcion)
    } catch (error) {
        next(error)
    }   
}

// POST /suscripciones (crear suscripción)
crearSuscripcion = async (req, res, next) => {
    try {
        const { id_usuario, tipo_usuario, fecha_inicio, fecha_renovacion } = req.body

        // --- Validar si falta algún campo ---
        const camposRequeridos = ["id_usuario", "tipo_usuario", "fecha_inicio", "fecha_renovacion"]
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

        // --- Validar que el tipo de usuario exista ---
        const tipoUsuario = await TipoUsuario.findByPk(tipo_usuario)
        if (!tipoUsuario) {
            console.log(chalk.yellow(`Tipo de usuario con id ${tipo_usuario} no encontrado`))
            return res.status(404).json({ error: "Tipo de usuario no encontrado" })
        }

        // --- Validar fechas ---
        if (fecha_inicio > fecha_renovacion) {
            console.log(chalk.red(`La fecha de inicio debe ser anterior a la de renovación`))
            return res.status(400).json({ error: "La fecha de inicio debe ser anterior a la de renovación" })
        }

        // --- Crear suscripción ---
        const suscripcion = await Suscripcion.create({
            id_usuario,
            tipo_usuario,
            fecha_inicio,
            fecha_renovacion,
        })

        console.log(chalk.green(`Suscripción creada correctamente`))        
        res.status(201).json({ message: "Suscripción creada correctamente", suscripcion })
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            console.log(chalk.red(`La suscripción ya existe para ese usuario`))
            return res.status(400).json({ error: "La suscripción ya existe para ese usuario" })
        }
        return next(error)
    }
}

module.exports = {
  getSuscripciones,
  getSuscripcionByID,
  crearSuscripcion,
}