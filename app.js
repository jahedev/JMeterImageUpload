const express = require("express")
const app = express()
const router = express.Router()
const pug = require("pug")
const bodyParser = require("body-parser")
const fileupload = require("express-fileupload")
const session = require("express-session")
const cookieParser = require("cookie-parser")
const requireAuth = require("./middleware/requireAuth")
const logger = require("./lib/logger")
const { createFolder } = require("./lib/fileops")
const port = 80

// --- CONFIGURATION ---
app.set("view engine", "pug")
app.set("trust proxy", 1) // trust first proxy
app.set("config", require("./config"))
const config = app.get("config")
createFolder(config.customSettings.uploadPath) // create folder where files are uploaded

// --- MIDDLEWARE ---
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(fileupload(config.fileupload))
app.use(session(config.session))
app.use("/public", express.static("public"))

// --- ROUTES ---
app.use("/", require("./routes/root"))
app.use("/", require("./routes/login"))
app.use("/home", requireAuth, require("./routes/home"))
app.use("/files", require("./routes/files"))
app.use("/myfiles", requireAuth, require("./routes/myfiles"))
app.use("/testdb", require("./routes/testdb"))
app.use("/uploadImage", require("./routes/uploadImage"))

// --- RUN SERVER ---
app.listen(port, () => {
  console.log("\n\n")
  logger.special(`Listening on http://localhost:${port}/`, "Server Status")
})
