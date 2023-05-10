const express = require('express')
const router = express.Router()

router.post('/', (req, res) => {
  const { imageName, imageDesc, imageFile } = req.body
  let uploadedUrl = 'N/A'
  let success = true

  // finally
  res.render('uploadImage', { success, imageName, imageDesc, uploadedUrl })
})

module.exports = router
