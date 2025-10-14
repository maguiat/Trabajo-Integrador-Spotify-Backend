const express = require("express")
const app = express()

process.loadEnvFile()
const PORT = process.env.PORT || 3000
const sequelize = require('./src/config/database')

app.use(express.json())

app.get('/', async (req, res) => {
 try {
    await sequelize.authenticate()
    res.send('Conexión exitosa a la base de datos')
 } catch (error) {
    console.error('Error de conexión a la base de datos:', error)

 }
})

// Establecer conexión del servidor
app.listen(PORT, () => {
 try {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
 } catch (error) {
    console.error('Error al iniciar el servidor:', error)
 }
})



