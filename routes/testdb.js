const express = require('express')
const router = express.Router()
const { getUser, userExists, insertUser } = require('../db/models/users')

router.get('/getUser/:user', async (req, res) => {
  let username = req.params.user

  let user
  try {
    user = await getUser(username)
  } catch (error) {
    console.log(error)
  }

  res.send(
    `<h1>getUser: ${username}</h1><h2>${
      user ? JSON.stringify(user) : 'does not exist'
    }</h2>`
  )
})

router.get('/userExists/:user', async (req, res) => {
  let username = req.params.user

  let exists
  try {
    exists = await userExists(username)
  } catch (error) {
    console.log(error)
  }

  res.send(`<h1>userExists: ${username}</h1><h2>${exists}</h2>`)
})

router.get('/insertUser/:tokens', async (req, res) => {
  let tokens = req.params.tokens
  const [username, password, firstname, lastname, email] = tokens.split('&')

  if (![username, password, firstname, lastname].every((item) => Boolean(item)))
    return res.send('must include: username, password, firstname, lastname')

  let status
  try {
    status = await insertUser(
      username,
      password,
      firstname,
      lastname,
      email || ''
    )
  } catch (error) {
    console.log(error)
  }

  res.send(
    `<h1>getUser: ${username}</h1><p>
      ${username} ${password} ${firstname} ${lastname} ${email}
    </p>
    <p>${status}</p>`
  )
})

module.exports = router
