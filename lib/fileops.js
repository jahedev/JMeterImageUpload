// fileops.js: miscellaneous file operations

const fs = require("fs")

exports.createFolder = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath)
    console.log(`${folderPath} Folder created successfully.`)
  } else console.log(`${folderPath} Folder already exists.`)
}
