const express = require("express")
const router = express.Router()
const captcha = require("../lib/captcha")

router.get("/", (req, res) => {
  const captchaObject = captcha()
  req.session.captchaText = captchaObject.text

  if (!req.query?.type)
    return res.render("captcha", { captchaImage: captchaObject.data })

  switch (req.query.type) {
    case "nocaptcha":
      res.render("index")
      break
    default:
      res.render("captcha", { captchaImage: captchaObject.data })
  }
})

router.get("/protected", (req, res) => {})

module.exports = router
