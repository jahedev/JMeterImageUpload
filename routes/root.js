const express = require("express")
const router = express.Router()
const captcha = require("../lib/captcha")

router.get("/", (req, res) => {
  res.redirect("/home")
})

module.exports = router
