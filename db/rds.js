var postgres = require('postgres')

require('dotenv').config()

const {
  RDS_DB_NAME: database,
  RDS_USERNAME: username,
  RDS_PASSWORD: password,
  RDS_HOSTNAME: hostname,
  RDS_PORT: port,
} = process.env

const rds = postgres({ hostname, port, database, username, password })

module.exports = rds
