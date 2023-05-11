const express = require('express')
const router = express.Router()
const aws = require('../lib/aws_client')
const uuid = require('uuid')
const fs = require('fs')
const multer = require('multer')

router.get('/', (req, res) => {
  res.render('error', {
    title: '404 - Not Found',
    message:
      'You are supposed to send a POST request with the file through the form.',
  })
})

router.post('/', async (req, res, next) => {
  // file upload error checking and restrictions
  {
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
      fileType !== 'image/gif'
    ) {
      res.render('error', {
        title: '400 - Bad Request',
        message: 'That file extension is not supported.',
      })
      return
    }
  }

  const { imageName, imageDesc, imageFile } = req.body
  let uploadedUrl = 'N/A'
  let success = true

  // console.log(form)

  // const key = uuid.v4() + '.txt'
  // console.log(key)
  // console.log(req.headers['filename'])
  // console.log(typeof imageFile)

  // console.log(req)

  // await aws.createObject(imageFile, key)
  // await aws.listBuckets()

  // finally
  res.render('uploadImage', { success, imageName, imageDesc, uploadedUrl })
})

module.exports = router
