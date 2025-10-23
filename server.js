const express = require("express")
const app = require('./src/app')
const PORT = process.env.PORT || 3000
const chalk = require("chalk")

process.loadEnvFile()

app.use(express.json())

// Establecer conexión del servidor
app.listen(PORT, () => {
 try {
    console.log(chalk.blue.bold(`🚀 Servidor corriendo en http://localhost:${PORT}`))
    console.log(chalk.blue.bold(`📚 Documentación de la API en http://localhost:${PORT}/api-docs`))
 } catch (error) {
    console.log(chalk.red.bold(`Error al iniciar el servidor: ${error}`))
 }
})



