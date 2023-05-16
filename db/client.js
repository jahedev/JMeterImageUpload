// var postgres = require('postgres')
const { Client } = require('pg')
require('dotenv').config()

const client = new Client({
  host: process.env.RDS_HOSTNAME,
  port: process.env.RDS_PORT,
  database: process.env.RDS_DB_NAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
})

client
  .connect()
  .then(() => console.log('connected to database'))
  .catch((err) => {
    console.error('connection error', err.stack)
    process.exit(1)
  })

module.exports = client
