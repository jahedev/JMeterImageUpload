const express = require('express')
const router = express.Router()
const users = require('../db/models/users')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', async (req, res) => {
  const { username, password } = req.body

  const user = await getUser(username)
})

router.get('/signup', (req, res) => {
  res.render('signup')
})

router.post('/signup', (req, res) => {})

router.get('/test', async (req, res) => {
  let data
  try {
    data = await users.getUser('john_doe')
  } catch (error) {
    console.log(error)
  }

  // console.log(data)
  res.send('<h1>testing</h1>')
})

router.get('/test2', async (req, res) => {
  let data
  try {
    data = await users.insertUser(
      'john_doe6',
      'password123',
      'John',
      'Doe',
      'john6@example.com'
    )
    console.log(data)
  } catch (error) {
    console.log(error)
  }

  // console.log(data)
  res.send('<h1>testing 2</h1>')
})

module.exports = router
