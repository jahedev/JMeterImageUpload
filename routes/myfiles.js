const express = require("express")
const requireAuth = require("../middleware/requireAuth")
const { getFiles } = require("../db/models/files")
const router = express.Router()

router.get("/", requireAuth, async (req, res) => {
  let files
  try {
    files = await getFiles(req.user.user_id)
  } catch (err) {
    console.log(err.stack)
    console.log("unable to get my files")
  }

  console.log(files)

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
