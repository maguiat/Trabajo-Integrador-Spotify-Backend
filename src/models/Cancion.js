const { DataTypes } = require('sequelize')
const sequelize= require('../config/database')

const Cancion = sequelize.define('cancion', {
    id_cancion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    titulo: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    duracion_seg: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    // FK
    id_album: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    reproducciones: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
    },
    likes: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
    },
    fecha_agregada: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
}, {
    tableName: 'cancion',
    timestamps: false
})

module.exports = Cancion