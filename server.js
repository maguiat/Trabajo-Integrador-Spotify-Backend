const express = require("express")
const app = require('./src/app')
const PORT = process.env.PORT || 3000
const sequelize = require('./src/config/database')

process.loadEnvFile()

app.use(express.json())

// Establecer conexión del servidor
app.listen(PORT, () => {
 try {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
 } catch (error) {
    console.error('Error al iniciar el servidor:', error)
 }
})



