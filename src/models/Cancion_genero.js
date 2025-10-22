const { DataTypes } = require('sequelize')
const sequelize= require('../config/database')

const CancionGenero = sequelize.define('cancion_genero', {
    id_cancion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'cancion',
            key: 'id_cancion'
        }
    },
    id_genero: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'genero',
            key: 'id_genero'
        }
    },
}, {
    tableName: 'cancion_genero',
    timestamps: false
})

module.exports = CancionGenero