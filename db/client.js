// var postgres = require('postgres')
const { Client } = require("pg")
const logger = require("../lib/logger")
require("dotenv").config()

const client = new Client({
  host: process.env.RDS_HOSTNAME,
  port: process.env.RDS_PORT,
  database: process.env.RDS_DB_NAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
})

client
  .connect()
  .then(() => logger.special("connected to db", "Database"))
  .catch((err) => {
    console.error("connection error", err.stack)
    logger.error("unable to connect to db", "Database")
    process.exit(1)
  })

module.exports = client
