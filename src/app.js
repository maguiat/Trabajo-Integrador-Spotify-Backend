
const express = require("express")
const routes = require("./routes")
const sequelize = require("./config/database")
const chalk = require("chalk")
const swaggerUi = require('swagger-ui-express')
const fs = require('fs')
const yaml = require('yaml')

const app = express()

app.use(express.json())


let dbOK = false
app.use(async (req, res, next) => {
    try {
        if (!dbOK) {
            await sequelize.authenticate()
            dbOK = true
            console.log(chalk.green.bold("✅ Conexión exitosa a la base de datos"))
        }
        next()
    } catch (error) {
        console.log(chalk.red.bold("💥 Error de conexión a la base de datos:"), error)
        res.status(500).json({ error: "Error de conexión a la base de datos" })
    } 
})

// Swagger (leer el YAML y mostrarlo)
const swaggerFile = fs.readFileSync("./src/docs/swagger.yaml", "utf8")
const swaggerSpec = yaml.parse(swaggerFile)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))


// Manejo de errores de sintaxis JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error(chalk.red.bold('❌ Error de sintaxis JSON:', err.message))
    return res.status(400).json({
      error: 'El cuerpo de la petición tiene un formato JSON inválido.'
    })
  }
  next()
})

// Rutas
app.use('/api/v1', routes)

// Manejo de rutas no encontradas
app.use((req, res) => {
  console.log(chalk.yellow(`⚠️  Ruta no encontrada: ${req.method} ${req.originalUrl}`))
  
  res.status(404).json({
    error: "Recurso no encontrado",
    message: "La ruta solicitada no existe en el servidor.",
    method: req.method,
    path: req.originalUrl,
  })
})


// Manejo de errores internos
app.use((err, req, res, next) => {
  console.error(chalk.red.bold("💥 Error interno del servidor:"), err)

  res.status(500).json({
    error: "Error interno del servidor",
    description: err.message || "Ocurrió un error inesperado.",
    path: req.originalUrl,
    method: req.method,
  })
})

module.exports = app