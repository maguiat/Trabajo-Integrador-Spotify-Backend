const { DataTypes } = require('sequelize')
const sequelize= require('../config/database')

const Album = sequelize.define('album', {
    id_album: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    titulo: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    // FK
    id_artista: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    // FK
    id_discografica: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    imagen_portada: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    anio_publicacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    duracion_total_seg: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    tableName: 'album',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['titulo', 'id_artista']
        }
    ]
})

module.exports = Album