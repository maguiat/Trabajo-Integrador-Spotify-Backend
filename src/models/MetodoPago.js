const { DataTypes } = require('sequelize')
const sequelize= require('../config/database')

const MetodoPago = sequelize.define('metodo_pago', {
    id_metodo_pago: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    // FK
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuario',
            key: 'id_usuario',
        },
    },
    tipo_forma_pago: {
        type: DataTypes.ENUM('Credito', 'Debito', 'Efectivo', 'Debito Automatico x Banco'),
        allowNull: false,
    },
    cbu: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    banco_codigo: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    nro_tarjeta_masc: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    mes_caduca: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    anio_caduca: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'metodo_pago',
    timestamps: false
})

module.exports = MetodoPago