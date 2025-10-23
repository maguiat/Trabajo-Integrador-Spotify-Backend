const { DataTypes } = require('sequelize')
const sequelize= require('../config/database')

const Pago = sequelize.define('pago', {
    id_pago: {
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
    // FK
    id_suscripcion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'suscripcion',
            key: 'id_suscripcion',
        },
    },
    // FK
    id_metodo_pago: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'metodo_pago',
            key: 'id_metodo_pago',
        },
    },
    importe: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    fecha_pago: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: 'pago',
    timestamps: false
})

module.exports = Pago