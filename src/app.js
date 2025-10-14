
const express = require("express")
const routes = require("./routes")
const sequelize = require("./config/database")

const app = express()

app.use(express.json())


let dbOK = false
app.use(async (req, res, next) => {
    try {
        if (!dbOK) {
            await sequelize.authenticate()
            dbOK = true
            console.log('Conexión exitosa a la base de datos')
        }
        next()
    } catch (error) {
        console.log('Error de conexión a la base de datos:', error)
        res.status(500).json({ error: "Error de conexión a la base de datos" })
    } 
})

// Rutas
app.use('/api/v1', routes)

// Manejo de rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ error: "Recurso no encontrado" })
})


module.exports = app