const express = require("express")
const router = express.Router()
const { getUser, userExists, insertUser } = require("../db/models/users")
const { getFiles, insertFile } = require("../db/models/files")
const jwt = require("jsonwebtoken")
const requireAuth = require("../middleware/requireAuth")

router.get("/getUser/:user", async (req, res) => {
  let username = req.params.user

  let user
  try {
    user = await getUser(username)
  } catch (error) {
    console.log(error)
  }

  res.send(
    `<h1>getUser: ${username}</h1><h2>${
      user ? JSON.stringify(user) : "does not exist"
    }</h2>`
  )
})

router.get("/userExists/:user", async (req, res) => {
  let username = req.params.user

  let exists
  try {
    exists = await userExists(username)
  } catch (error) {
    console.log(error)
  }

  res.send(`<h1>userExists: ${username}</h1><h2>${exists}</h2>`)
})

router.get("/insertUser/:tokens", async (req, res) => {
  let tokens = req.params.tokens
  const [username, password, firstname, lastname, email] = tokens.split("&")

  if (![username, password, firstname, lastname].every((item) => Boolean(item)))
    return res.send("must include: username, password, firstname, lastname")

  let status
  try {
    status = await insertUser(
      username,
      password,
      firstname,
      lastname,
      email || ""
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

router.get("/insertFile/:tokens", requireAuth, async (req, res) => {
  const user = req.user
  const { user_id } = req.user

  let tokens = req.params.tokens
  const [file_url, file_name, file_description] = tokens.split("&")

  if (![file_url, file_name, file_description].every((item) => Boolean(item)))
    return res.send("must include: file_url, file_name, file_description")

  let file
  try {
    file = await insertFile(user_id, file_url, file_name, file_description)
  } catch (error) {
    console.log(error)
  }

  res.send(
    `<h1>insertFile for : ${req.user.username}</h1><p>
      ${user_id} ${file_url} ${file_name} ${file_description}
    </p>
    <p>${JSON.stringify(file)}</p>`
  )
})

router.get("/getFiles", requireAuth, async (req, res) => {
  const user = req.user
  const { user_id } = req.user

  let files
  try {
    files = await getFiles(user_id)
  } catch (error) {
    console.log(error)
  }

  res.send(
    `
    <p>${JSON.stringify(files)}</p>`
  )
})

module.exports = router
