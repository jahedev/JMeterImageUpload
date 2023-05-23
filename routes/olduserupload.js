const express = require("express")
const router = express.Router()
const aws = require("../lib/aws_client")
const uuid = require("uuid")
const fs = require("fs")
const multer = require("multer")
const captcha = require("../lib/captcha")
const { insertFile } = require("../db/models/files")
const requireAuth = require("../middleware/requireAuth")

const uploadDirectory = app.get("config").customSettings.uploadPath

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

const validateUpload = (req, res, next) => {
  /* --- ERROR CHECKING --- */
  // file upload error checking and restrictions
  if (!req.files || !req.files.imageFile)
    return res.render("error", {
      title: "400 - Bad Request",
      message: "You did not upload an image using the form.",
    })

  // validate file type
  req.fileType = req.files.imageFile.mimetype.trim()
  if (!acceptedFileTypes.has(req.fileType))
    return res.render("error", {
      title: "400 - Bad Request",
      message: "That file extension is not supported.",
    })

  next()
}

const configureUpload = (req, res, next) => {
  /* --- CONFIGURATION --- */

  const imageFile = req.files.imageFile

  // read data  either from memory
  // or generated temp file based on configuration
  req.useTempFiles = req.app.get("config").fileupload.useTempFiles
  if (req.useTempFiles)
    req.fileContent = fs.readFileSync(imageFile.tempFilePath)
  else req.fileContent = imageFile.data

  // useS3Bucket?
  req.useS3Upload = req.app.get("config").customSettings.useS3Upload

  // aws configuration
  req.imageName = req.body.imageName
  req.imageDesc = req.body.imageDesc
  const ext = req.fileType.substring(req.fileType.indexOf("/") + 1)
  req.uploadedUrl = ""

  // file to be uploaded with new filename
  req.newFileName = `${removeSpecialChars(req.imageName)}__${uuid.v4()}.${ext}`
  console.log(req.newFileName)

  next()
}

const uploadFile = async (req, res, next) => {
  // upload to aws s3
  if (req.useS3Upload) {
    await aws.createObject(req.fileContent, req.newFileName).then((result) => {
      console.log("file completed uploading.")
      console.log(result)
      req.uploadedUrl = result

      // delete temporary file
      if (req.useTempFiles)
        fs.unlink(req.imageFile.tempFilePath, (err) => {
          if (err) console.log(err)
        })
    })
  } else {
    fs.writeFileSync(`./${uploadDirectory}/${req.newFileName}`, req.fileContent)
    req.uploadedUrl = `./files/${req.newFileName}`

    if (req.useTempFiles)
      fs.unlink(req.imageFile.tempFilePath, (err) => {
        if (err) console.log(err)
      })
  }

  next()
}

const updateDatabase = async (req, res, next) => {
  await insertFile(
    req.user.user_id,
    req.uploadedUrl,
    req.imageName,
    req.imageDesc
  )
}

router.post(
  "/",
  requireAuth,
  validateUpload,
  configureUpload,
  uploadFile,
  updateDatabase,
  async (req, res, next) => {
    // render upload page
    res.render("uploadImage", {
      imageName: req.imageName,
      imageDesc: req.imageDesc,
      uploadedUrl: req.imageDesc,
    })
  }
)

router.post("/captcha", async (req, res, next) => {
  if (
    !req.session.captchaText ||
    !req.body.captcha ||
    req.session.captchaText !== req.body.captcha
  )
    return res.render("error", {
      title: "400 - Bad Request",
      message: "You did not type the CAPTCHA text correctly.",
    })

  // finally
  res.render("uploadImage", { imageName, imageDesc, uploadedUrl })
})

const removeSpecialChars = (str = "") => str.replace(/[^a-zA-Z0-9]/g, "")

module.exports = router
