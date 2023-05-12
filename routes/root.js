const express = require('express')
const router = express.Router()
const captcha = require('../lib/captcha')

router.get('/', (req, res) => {
  if (!req.query?.type) return res.render('index')

  switch (req.query.type) {
    case 'captcha':
      // Captcha Test
      const captchaObject = captcha()
      res.render('captcha', { captchaImage: captchaObject.data })
      req.session.captchaText = captchaObject.text
      console.log(req.session)
      break
    default:
      res.render('index')
  }
})

module.exports = router
