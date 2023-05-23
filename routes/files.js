const express = require("express")
const router = express.Router()
const fs = require("fs")
const logger = require("../lib/logger")

router.get("/:filename", async (req, res) => {
  const uploadDirectory = req.app.get("config").customSettings.uploadPath

  let { filename } = req.params
  let path = `${uploadDirectory}/${filename}`

  // check if file exists
  if (!fs.existsSync(path)) {
    logger.error(
      `unable to retrieve uploaded file: '/files/${filename}'`,
      "Download"
    )
    return res.sendStatus(404)
  }

  logger.log(`retrieving uploaded file: '/files/${filename}'`, "Download")

  // create a download link
  res.download(path)
})

module.exports = router
