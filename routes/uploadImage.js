const express = require('express')
const router = express.Router()
const aws = require('../lib/aws_client')
const uuid = require('uuid')
const fs = require('fs')
const multer = require('multer')
const captcha = require('../lib/captcha')

router.get('/', (req, res) => {
  // Captcha Test
  // const captchaObject = captcha()
  // const captchaText = captchaObject.text
  // res.render('captcha', { captchaImage: captchaObject.data })
  // console.log(captchaText)
  // return

  res.render('error', {
    title: '404 - Not Found',
    message:
      'You are supposed to send a POST request with the file through the form.',
  })
})

router.post('/', async (req, res, next) => {
  // file upload error checking and restrictions
  if (!req.files || !req.files.imageFile) {
    res.render('error', {
      title: '400 - Bad Request',
      message: 'You did not upload an image using the form.',
    })
    return
  }

  const fileType = req.files.imageFile.mimetype.trim()

  if (
    fileType !== 'image/png' &&
    fileType !== 'image/jpg' &&
    fileType !== 'image/jpeg' &&
    fileType !== 'image/gif'
  ) {
    // console.log('Unsupported Extension: ' + fileType)
    res.render('error', {
      title: '400 - Bad Request',
      message: 'That file extension is not supported.',
    })
    return
  }

  const { imageName, imageDesc, imageFile } = req.body
  const ext = fileType.substring(fileType.indexOf('/') + 1)
  let uploadedUrl = 'N/A'
  let success = true

  // upload to aws s3
  const key = `${removeSpecialChars(imageName)}${uuid.v4()}.${ext}`
  const filePath = req.files.imageFile.tempFilePath
  const fileContent = fs.readFileSync(filePath)

  await aws.createObject(fileContent, key).then((result) => {
    console.log('file completed uploading.')
    console.log(result)
    uploadedUrl = result

    // delete temporary file
    fs.unlink(filePath, (err) => {
      if (err) console.log(err)
    })
  })

  // finally
  res.render('uploadImage', { success, imageName, imageDesc, uploadedUrl })
})

const removeSpecialChars = (str) => str.replace(/[^a-zA-Z0-9]/g, '')

module.exports = router
