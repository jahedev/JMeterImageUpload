const express = require("express")
const router = express.Router()
const aws = require("../lib/aws_client")
const uuid = require("uuid")
const fs = require("fs")
const multer = require("multer")
const captcha = require("../lib/captcha")
const { insertFile } = require("../db/models/files")
const requireAuth = require("../middleware/requireAuth")
const logger = require("../lib/logger")

const acceptedFileTypes = new Set([
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/gif",
])

// Tell user that this is a POST rotue
router.get("/", (req, res) => {
  res.render("error", {
    title: "404 - Not Found",
    message:
      "You are supposed to send a POST request with the file through the form.",
  })
})

router.post("/nocaptcha", requireAuth, async (req, res, next) => {
  const uploadDirectory = req.app.get("config").customSettings.uploadPath

  /* --- ERROR CHECKING --- */
  // file upload error checking and restrictions
  if (
    !(
      req.files &&
      req.files.imageFile &&
      req.body.imageName &&
      req.body.imageDesc
    )
  )
    return res.render("error", {
      title: "400 - Bad Request",
      message:
        "You must provide an image name, description, and the file you want to upload.",
    })

  // validate file type
  const fileType = req.files.imageFile.mimetype.trim()
  if (!acceptedFileTypes.has(fileType))
    return res.render("error", {
      title: "400 - Bad Request",
      message: "That file extension is not supported.",
    })

  /* --- CONFIGURATION --- */

  const imageFile = req.files.imageFile

  // read data  either from memory
  // or generated temp file based on configuration
  const { useTempFiles } = req.app.get("config").fileupload
  let fileContent
  if (useTempFiles) fileContent = fs.readFileSync(imageFile.tempFilePath)
  else fileContent = imageFile.data

  // useS3Bucket?
  const { useS3Upload } = req.app.get("config").customSettings

  // aws configuration
  const { imageName, imageDesc } = req.body
  const ext = fileType.substring(fileType.indexOf("/") + 1)
  let uploadedUrl = ""

  // file to be uploaded with new filename
  const newFileName = `${removeSpecialChars(imageName)}__${uuid.v4()}.${ext}`

  // upload to aws s3
  if (useS3Upload)
    await aws.createObject(fileContent, newFileName).then((result) => {
      logger.log("file upload complete", "AWS")
      uploadedUrl = result

      // delete temporary file
      if (useTempFiles)
        fs.unlink(imageFile.tempFilePath, (err) => {
          if (err) {
            console.log(err)
            logger.error("unable to delete temporary file", "Temp Files")
          }
        })
    })
  else {
    fs.writeFileSync(`./${uploadDirectory}/${newFileName}`, fileContent)
    uploadedUrl = `/files/${newFileName}`

    if (useTempFiles)
      fs.unlink(imageFile.tempFilePath, (err) => {
        if (err) {
          console.log(err)
          logger.error("unable to delete temporary file", "Temp Files")
        }
      })
  }

  // update database
  const dbResult = await insertFile(
    req.user.user_id,
    uploadedUrl,
    imageName,
    imageDesc
  )
  console.log(dbResult)
  logger.log("file upload complete", "File Upload")

  // render upload page
  res.render("uploadImage", { imageName, imageDesc, uploadedUrl })
})

router.post("/", requireAuth, async (req, res, next) => {
  const uploadDirectory = req.app.get("config").customSettings.uploadPath

  if (
    !req.session.captchaText ||
    !req.body.captcha ||
    req.session.captchaText !== req.body.captcha
  ) {
    logger.error("user failed captcha or didn't do it properly", "Captcha")
    return res.render("error", {
      title: "400 - Bad Request",
      message: "You did not type the CAPTCHA text correctly.",
    })
  }

  /* --- ERROR CHECKING --- */
  // file upload and valid input checking and restrictions
  if (
    !(
      req.files &&
      req.files.imageFile &&
      req.body.imageName &&
      req.body.imageDesc
    )
  )
    return res.render("error", {
      title: "400 - Bad Request",
      message:
        "You must provide an image name, description, and the file you want to upload.",
    })

  // validate file type
  const fileType = req.files.imageFile.mimetype.trim()
  if (!acceptedFileTypes.has(fileType))
    return res.render("error", {
      title: "400 - Bad Request",
      message: "That file extension is not supported.",
    })

  /* --- CONFIGURATION --- */

  const imageFile = req.files.imageFile

  // read data  either from memory
  // or generated temp file based on configuration
  const { useTempFiles } = req.app.get("config").fileupload
  let fileContent
  if (useTempFiles) fileContent = fs.readFileSync(imageFile.tempFilePath)
  else fileContent = imageFile.data

  // useS3Bucket?
  const { useS3Upload } = req.app.get("config").customSettings

  // aws configuration
  const { imageName, imageDesc } = req.body
  const ext = fileType.substring(fileType.indexOf("/") + 1)
  let uploadedUrl = ""

  // file to be uploaded with new filename
  const newFileName = `${removeSpecialChars(imageName)}__${uuid.v4()}.${ext}`

  // upload to aws s3
  if (useS3Upload)
    await aws.createObject(fileContent, newFileName).then((result) => {
      logger.log("file upload complete")
      uploadedUrl = result

      // delete temporary file
      if (useTempFiles)
        fs.unlink(imageFile.tempFilePath, (err) => {
          if (err) {
            console.log(err)
            logger.error("unable to delete temporary file", "Temp Files")
          }
        })
    })
  else {
    fs.writeFileSync(`./${uploadDirectory}/${newFileName}`, fileContent)
    uploadedUrl = `/files/${newFileName}`

    if (useTempFiles)
      fs.unlink(imageFile.tempFilePath, (err) => {
        if (err) {
          console.log(err)
          logger.error("unable to delete temporary file", "Temp Files")
        }
      })
  }

  // update database
  const dbResult = await insertFile(
    req.user.user_id,
    uploadedUrl,
    imageName,
    imageDesc
  )
  console.log(dbResult)
  logger.log("file upload complete", "File Upload")

  // render upload page
  res.render("uploadImage", { imageName, imageDesc, uploadedUrl })
})

const uploadFile = () => {}

const removeSpecialChars = (str = "") => str.replace(/[^a-zA-Z0-9]/g, "")

module.exports = router
