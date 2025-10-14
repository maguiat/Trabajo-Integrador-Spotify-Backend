const { DataTypes } = require('sequelize')
const sequelize= require('../config/database')

const Usuario = sequelize.define('usuario', {
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    password_hash: { 
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    fecha_nac: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    sexo: { 
        type: DataTypes.ENUM('F', 'M'),
        allowNull: false,
    },
    cp: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    // FK
    id_pais: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    // FK
    tipo_usuario_actual: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    fecha_ult_mod_password: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },

}, {
    tableName: 'usuario',
    timestamps: false
})

module.exports = Usuario