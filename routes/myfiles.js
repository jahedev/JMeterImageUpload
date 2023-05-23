const express = require("express")
const requireAuth = require("../middleware/requireAuth")
const { getFiles } = require("../db/models/files")
const logger = require("../lib/logger")
const router = express.Router()

router.get("/", requireAuth, async (req, res) => {
  let files
  try {
    files = await getFiles(req.user.user_id)
  } catch (err) {
    console.log(err.stack)
    logger.log("unable to get 'My Files'", "Route: My Files")
  }

  logger.log(`successfully retrieved user's uploaded files`, "My Files")

  res.render("myfiles", {
    files,
    toHref: (url) => `<a href=${url}>Download</a>`,
    dateFormat: (dateStr) => {
      let date = new Date(dateStr)
      return `${date.toDateString()} ${date.toLocaleTimeString()}`
    },
  })
})

module.exports = router
