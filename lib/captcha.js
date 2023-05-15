const svgCaptcha = require('svg-captcha')

const { testMode } = require('../config').captcha

const testCaptcha = () => ({
  text: 'test',
  data: svgCaptcha('test'),
})

const generateCaptcha = () => (testMode && testCaptcha()) || svgCaptcha.create()

module.exports = generateCaptcha
