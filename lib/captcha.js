const svgCaptcha = require("svg-captcha")

const { useTestCaptcha } = require("../config").customSettings

const testCaptcha = () => ({
  text: "test",
  data: svgCaptcha("test"),
})

const generateCaptcha = () =>
  (useTestCaptcha && testCaptcha()) || svgCaptcha.create()

module.exports = generateCaptcha
