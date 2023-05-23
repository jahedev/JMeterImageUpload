// fileops.js: miscellaneous file operations
const logger = require("../lib/logger")

const fs = require("fs")

exports.createFolder = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath)
    logger.log(`${folderPath} Folder created successfully.`)
  }
}
