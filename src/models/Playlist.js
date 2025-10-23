const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")

const Playlist = sequelize.define("playlist", {
  id_playlist: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titulo: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  // FK
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "usuario",
      key: "id_usuario",
    },
  },
  cant_canciones: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  estado: {
    type: DataTypes.ENUM("Activa", "Eliminada"),
    defaultValue: "Activa",
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  fecha_eliminada: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: "playlist",
  timestamps: false,
})

module.exports = Playlist