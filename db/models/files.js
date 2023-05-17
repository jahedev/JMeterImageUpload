const client = require("../client")

exports.getFiles = async function (user_id) {
  const q = {
    name: "getFiles",
    text: `
        SELECT f.*
        FROM files f
        JOIN users u ON f.user_id = u.user_id
        WHERE u.user_id = $1
        ORDER BY f.upload_date DESC
        LIMIT 20
    `,
    values: [user_id],
  }

  return client
    .query(q)
    .then((res) => res.rows)
    .catch((err) => console.log(err.stack))
}

exports.insertFile = async function (
  user_id,
  file_url,
  file_name,
  file_description
) {
  const q = {
    name: "insertFile",
    text: `INSERT INTO files (user_id, file_url, file_name, file_description)
    VALUES ($1, $2, $3, $4) RETURNING *
    `,
    values: [user_id, file_url, file_name, file_description],
  }

  return client
    .query(q)
    .then((res) => res.rows)
    .catch((err) => console.log(err.stack))
}
