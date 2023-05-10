const express = require('express')
const router = express.Router()
const aws = require('../lib/aws_client')

router.get('/', (req, res) => {
  res.send(
    `<h1>404 - Not Found</h1>
    <p>You are supposed to send a POST request with the file through the form.</p>
    `
  )
})

router.post('/', async (req, res) => {
  const { imageName, imageDesc, imageFile } = req.body
  let uploadedUrl = 'N/A'
  let success = true

  // finally
  res.render('uploadImage', { success, imageName, imageDesc, uploadedUrl })
})

module.exports = router
