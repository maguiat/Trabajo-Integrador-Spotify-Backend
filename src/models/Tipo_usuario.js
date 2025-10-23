const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")

const TipoUsuario = sequelize.define("tipo_usuario", {
  id_tipo_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre_tipo: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
}, {
  tableName: "tipo_usuario",
  timestamps: false,
})  

module.exports = TipoUsuario