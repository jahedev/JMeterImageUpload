const client = require('../client')

const tableName = 'users'

async function getUser(username) {
  const query = {
    name: 'getUser',
    text: 'SELECT * FROM users WHERE username = $1',
    values: [username],
  }

  client
    .query(query)
    .then((res) => res.rows[0])
    .catch((err) => console.log(err))
}

async function userExists(username, email) {
  const query = {
    name: 'getUser',
    text: email
      ? 'SELECT * FROM users WHERE username = $1 or email = $2'
      : 'SELECT * FROM users WHERE username = $1',
    values: email ? [username, email] : [email],
  }

  client.query(query, (err, res) => {
    if (err) {
      console.log(err.stack)
    } else {
      console.log(res.rows)
      return res.rows[0]
    }
  })

  // await client
  //   .query(query)
  //   .then((res) => res.rowCount > 0)
  //   .catch((err) => console.log(err))
}

async function insertUser(username, password, firstname, lastname, email = '') {
  // TODO: check if username or email already exists
  console.log(await userExists(username))
  // console.log('------>\n\n', u)
  // if (u) {
  //   return {
  //     status: 'error',
  //     message: 'username or email already exists',
  //   }
  // }
  // const query = {
  //   name: 'insertUser',
  //   text: `
  //     INSERT INTO users (username, email, password, firstname, lastname)
  //     VALUES ($1, $2, $3, $4, $5) RETURNING *;
  //   `,
  //   values: [username, email, password, firstname, lastname],
  // }
  // client
  //   .query(query)
  //   .then((res) => res.rows[0])
  //   .catch((err) => console.log(err))
}

exports.insertUser = insertUser
exports.getUser = getUser
