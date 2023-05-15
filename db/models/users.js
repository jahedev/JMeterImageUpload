const sql = require('../rds')

const tableName = 'users'

async function getUser(username) {
  const user = await sql`
  SELECT *
  FROM ${tableName}
  WHERE username = ${username};
  `
  return user
}

exports.getUser = getUser
