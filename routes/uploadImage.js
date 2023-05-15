const express = require('express')
const router = express.Router()
const aws = require('../lib/aws_client')
const uuid = require('uuid')
const fs = require('fs')
const multer = require('multer')
const captcha = require('../lib/captcha')

const acceptedFileTypes = new Set([
  'image/png',
  'image/jpg',
  'image/jpeg',
  'image/gif',
])

// Tell user that this is a POST rotue
router.get('/', (req, res) => {
  res.render('error', {
    title: '404 - Not Found',
    message:
      'You are supposed to send a POST request with the file through the form.',
  })
})

router.post('/', async (req, res, next) => {
  /* --- ERROR CHECKING --- */
  // file upload error checking and restrictions
  if (!req.files || !req.files.imageFile)
    return res.render('error', {
      title: '400 - Bad Request',
      message: 'You did not upload an image using the form.',
    })

  // validate file type
  const fileType = req.files.imageFile.mimetype.trim()
  if (!acceptedFileTypes.has(fileType))
    return res.render('error', {
      title: '400 - Bad Request',
      message: 'That file extension is not supported.',
    })

  /* --- CONFIGURATION --- */

  const imageFile = req.files.imageFile

  // read data  either from memory
  // or generated temp file based on configuration
  const { useTempFiles } = req.app.get('config').fileupload
  let fileContent
  if (useTempFiles) fileContent = fs.readFileSync(imageFile.tempFilePath)
  else fileContent = imageFile.data

  // aws configuration
  const { imageName, imageDesc } = req.body
  const ext = fileType.substring(fileType.indexOf('/') + 1)
  let uploadedUrl = ''

  // file to be uploaded with new filename
  const newFileName = `${removeSpecialChars(imageName)}__${uuid.v4()}.${ext}`

  // upload to aws s3
  await aws.createObject(fileContent, newFileName).then((result) => {
    console.log('file completed uploading.')
    console.log(result)
    uploadedUrl = result

    // delete temporary file
    if (useTempFiles)
      fs.unlink(imageFile.tempFilePath, (err) => {
        if (err) console.log(err)
      })
  })

  // render upload page
  res.render('uploadImage', { imageName, imageDesc, uploadedUrl })
})

router.post('/captcha', async (req, res, next) => {
  if (
    !req.session.captchaText ||
    !req.body.captcha ||
    req.session.captchaText !== req.body.captcha
  )
    return res.render('error', {
      title: '400 - Bad Request',
      message: 'You did not type the CAPTCHA text correctly.',
    })

  /* --- ERROR CHECKING --- */
  // file upload error checking and restrictions
  if (!req.files || !req.files.imageFile)
    return res.render('error', {
      title: '400 - Bad Request',
      message: 'You did not upload an image using the form.',
    })

  // validate file type
  const fileType = req.files.imageFile.mimetype.trim()
  if (!acceptedFileTypes.has(fileType))
    return res.render('error', {
      title: '400 - Bad Request',
      message: 'That file extension is not supported.',
    })

  /* --- CONFIGURATION --- */

  const imageFile = req.files.imageFile

  // read data  either from memory
  // or generated temp file based on configuration
  const { useTempFiles } = req.app.get('config').fileupload
  let fileContent
  if (useTempFiles) fileContent = fs.readFileSync(imageFile.tempFilePath)
  else fileContent = imageFile.data

  // aws configuration
  const { imageName, imageDesc } = req.body
  const ext = fileType.substring(fileType.indexOf('/') + 1)
  let uploadedUrl = ''

  // file to be uploaded with new filename
  const newFileName = `${removeSpecialChars(imageName)}__${uuid.v4()}.${ext}`

  // upload to aws s3
  await aws.createObject(fileContent, newFileName).then((result) => {
    console.log('file completed uploading.')
    console.log(result)
    uploadedUrl = result

    // delete temporary file
    if (useTempFiles)
      fs.unlink(imageFile.tempFilePath, (err) => {
        if (err) console.log(err)
      })
  })

  // finally
  res.render('uploadImage', { imageName, imageDesc, uploadedUrl })
})

const removeSpecialChars = (str = '') => str.replace(/[^a-zA-Z0-9]/g, '')

module.exports = router
