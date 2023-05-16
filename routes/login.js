const express = require('express')
const router = express.Router()
const users = require('../db/models/users')
const jwt = require('jsonwebtoken')
const { getUser, userExists, insertUser } = require('../db/models/users')
const bcrypt = require('bcrypt')

router.get('/login', (req, res) => res.render('login'))

router.post('/login', async (req, res) => {
  const { username, password } = req.body

  const user = await getUser(username)
  if (!user) return res.render('login', { message: 'Username does not exist.' })

  if (password === user.password)
    return res.render('redirect', {
      url: '/',
      heading: 'Login Successful',
      message: 'Redirecting you to the homepage...',
    })
  else return res.render('login', { message: 'Password is incorrect.' })
})

router.get('/signup', (req, res) => res.render('signup'))

router.post('/signup', async (req, res) => {
  const { username, password, firstname, lastname, email } = req.body

  const userDuplicate = await userExists(username)
  if (userDuplicate)
    return res.render('signup', {
      message: 'Username or email already exists.',
    })

  // make sure fields are not undefined
  if (![username, password, firstname, lastname].every((item) => Boolean(item)))
    return res.render('signup', {
      message: 'You must include: username, password, firstname, lastname',
    })

  let user

  try {
    user = await insertUser(
      username,
      password,
      firstname,
      lastname,
      email || null
    )
  } catch (err) {
    // console.log(err.stack)
    console.log('=> Failed to create new user.')
  }

  if (user)
    return res.render('redirect', {
      url: '/login',
      heading: 'Signup Successful',
      message: 'Redirecting you to login...',
    })
  else return res.render('signup', { message: 'Failed to create new account.' })
})

module.exports = router
