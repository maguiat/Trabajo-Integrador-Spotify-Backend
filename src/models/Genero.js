const { DataTypes } = require('sequelize')
const sequelize= require('../config/database')

const Genero = sequelize.define('genero', {
    id_genero: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
}, {
    tableName: 'genero',
    timestamps: false
})

module.exports = Genero