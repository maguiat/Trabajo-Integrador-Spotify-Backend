const { DataTypes } = require('sequelize')
const sequelize= require('../config/database')

const PlaylistCancion = sequelize.define('playlist_cancion', {
    id_playlist: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'playlist',
            key: 'id_playlist'
        }
    },
    id_cancion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'cancion',
            key: 'id_cancion'
        }
    },
    orden: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'playlist_cancion',
    timestamps: false
})

module.exports = PlaylistCancion