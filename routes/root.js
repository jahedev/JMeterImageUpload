const express = require('express')
const router = express.Router()
const captcha = require('../lib/captcha')

router.get('/', (req, res) => {
  if (!req.query?.type) return res.render('index')

  switch (req.query.type) {
    case 'captcha':
      // Captcha Test
      const captchaObject = captcha()
      // console.log(req.session)
      req.session.captchaText = captchaObject.text
      res.render('captcha', { captchaImage: captchaObject.data })
      // console.log(req.session)
      break
    default:
      res.render('index')
  }
})

router.get('/protected', (req, res) => {})

module.exports = router
