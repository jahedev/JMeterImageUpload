const colors = require("colors")
const fs = require("fs")
const path = require("path")

let settings = {
  displayHeading: true,
  displayTime: true,
  writeToFile: true,
  logFilePath: "./app.log",
}

const getDate = function () {
  return settings.displayTime ? new Date().toLocaleString() : ""
}

const getHeading = function (heading) {
  return settings.displayHeading ? heading : ""
}

const logFileExists = () => {
  try {
    fs.accessSync(settings.logFilePath)
    return true
  } catch (err) {
    return false
  }
}

const createLogFile = () => {
  try {
    fs.appendFileSync(settings.logFilePath, "")
    return true
  } catch (error) {
    console.error(
      `Error: Cannot create file "${path.resolve(settings.logFilePath)}".
       Make sure parent directory exists and logFilePath setting does not include unsupported filesystem characters.`
        .red
    )
    return false
  }
}

const writeToFile = function (str) {
  if (!settings.writeToFile) return 0
  if (!createLogFile()) process.exit(1)
  fs.appendFileSync(settings.logFilePath, str + "\n")
}

const log = function (heading, str, colors) {
  const logStr = `[${getDate()} * ${getHeading(heading)}]: ` + str
  console.log(colors(logStr))
  writeToFile(logStr)
}

const logger = {
  log(str, message = "LOG") {
    log(message, str, colors.yellow)
  },
  message(str, message = "MESSAGE") {
    log(message, str, colors.green)
  },
  error(str, message = "ERROR") {
    log(message, str, colors.red)
  },
  special(str, message = "SPECIAL") {
    log(message, str, colors.bgGreen.black)
  },
}

module.exports = logger
