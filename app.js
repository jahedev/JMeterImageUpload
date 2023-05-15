const express = require('express')
const app = express()
const pug = require('pug')
const bodyParser = require('body-parser')
var fileupload = require('express-fileupload')
var session = require('express-session')
const port = 3000

// --- CONFIGURATION ---
app.set('view engine', 'pug')
app.set('trust proxy', 1) // trust first proxy
app.set('config', require('./config'))
const config = app.get('config')

// --- MIDDLEWARE ---

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileupload(config.fileupload))
app.use(session(config.session))

// --- ROUTES ---
app.use('/', require('./routes/root'))
app.use('/', require('./routes/login'))
app.use('/uploadImage', require('./routes/uploadImage'))

// --- RUN SERVER ---
app.listen(port, () => {
  console.log(`\nExample app listening on http://localhost:${port}/`)
})
