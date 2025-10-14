const { DataTypes } = require('sequelize')
const sequelize= require('../config/database')

const Suscripcion = sequelize.define('suscripcion', {
    id_suscripcion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    // FK
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    // FK
    tipo_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    fecha_inicio: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    fecha_renovacion: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: 'suscripcion',
    timestamps: false
})

module.exports = Suscripcion