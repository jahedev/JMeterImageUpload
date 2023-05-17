const express = require("express")
const router = express.Router()
const fs = require("fs")

router.get("/:filename", async (req, res) => {
  let { filename } = req.params
  let path = `./fileStore/${filename}`

  // check if file exists
  if (!fs.existsSync(path)) return res.sendStatus(404)

  // create a download link
  res.download(path)
})

module.exports = router
