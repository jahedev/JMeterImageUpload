const express = require('express')
const app = express()
const router = express.Router()
const pug = require('pug')
const bodyParser = require('body-parser')
const fileupload = require('express-fileupload')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const requireAuth = require('./middleware/requireAuth')
const port = 3000

// --- CONFIGURATION ---
app.set('view engine', 'pug')
app.set('trust proxy', 1) // trust first proxy
app.set('config', require('./config'))
const config = app.get('config')

// --- MIDDLEWARE ---
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(fileupload(config.fileupload))
app.use(session(config.session))

// --- ROUTES ---
app.use('/', require('./routes/root'))
app.use('/home', requireAuth, require('./routes/home'))
app.use('/', require('./routes/login'))
app.use('/testdb', require('./routes/testdb'))
app.use('/uploadImage', require('./routes/uploadImage'))

// --- RUN SERVER ---
app.listen(port, () => {
  console.log(`\nExample app listening on http://localhost:${port}/`)
})
