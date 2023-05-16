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

module.exports = router
