const { DataTypes } = require('sequelize')
const sequelize= require('../config/database')

const Artista = sequelize.define('artista', {
    id_artista: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    imagen_url: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
}, {
    tableName: 'artista',
    timestamps: false
})

module.exports = Artista