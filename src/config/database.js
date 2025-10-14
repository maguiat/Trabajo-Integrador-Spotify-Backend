const { Sequelize } = require('sequelize')
process.loadEnvFile()

const {DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT} = process.env

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'mysql',
  port: DB_PORT
})

module.exports = sequelize