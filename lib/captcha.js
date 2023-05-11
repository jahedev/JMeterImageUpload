const svgCaptcha = require('svg-captcha')

const generateCaptcha = () => {
  const captcha = svgCaptcha.create()
  return captcha
}

module.exports = generateCaptcha
