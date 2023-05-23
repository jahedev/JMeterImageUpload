const logger = require("../../lib/logger")
const client = require("../client")

const tableName = "users"

exports.getUser = async function (username) {
  const q = {
    name: "getUser",
    text: "SELECT * FROM users WHERE username = $1",
    values: [username],
  }

  return client
    .query(q)
    .then((res) => res.rows[0])
    .catch((err) => {
      console.log(err.stack)
      logger.error("unable to GET user", "SQL Query")
    })
}

exports.userExists = async function (username, email) {
  const q = {
    name: "userExists",
    text: email
      ? "SELECT * FROM users WHERE username = $1 or email = $2"
      : "SELECT * FROM users WHERE username = $1",
    values: email ? [username, email] : [username],
  }

  return client
    .query(q)
    .then((res) => {
      return Boolean(res.rows[0])
    })
    .catch((err) => {
      console.log(err.stack)
      logger.error("unable to check if user exists", "SQL Query")
    })
}

exports.insertUser = async function (
  username,
  password,
  firstname,
  lastname,
  email = null
) {
  if (await module.exports.userExists(username, email))
    return "user already exists"

  const q = {
    name: "insertUser",
    text: `INSERT INTO users (username, password, firstname, lastname, email)
    VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    values: [username, password, firstname, lastname, email],
  }

  return client
    .query(q)
    .then((res) => {
      console.log(res.rows)
      logger.log("user created", "SQL Query")
      return "user created"
    })
    .catch((err) => {
      console.log(err.stack)
      logger.error("unable to INSERT user", "SQL Query")
    })
}
