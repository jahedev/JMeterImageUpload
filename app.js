const express = require('express')
const app = express()
const pug = require('pug')
const bodyParser = require('body-parser')
var fileupload = require('express-fileupload')
var session = require('express-session')
const port = 3000

// --- MIDDLEWARE ---
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('trust proxy', 1) // trust first proxy
app.use(
  fileupload({
    useTempFiles: true,
    tempFileDir: 'tmp/',
    safeFileNames: true,
    preserveExtension: true,
  })
)
app.use(
  session({
    secret: '52fac80d8d257736ffcb7b71b4f925d1',
    // resave: true,
    // saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
    cookie: { secure: false, httpOnly: false },
  })
)
app.set('view engine', 'pug')
app.set('trust proxy', 1)

// --- ROUTES ---
app.use('/', require('./routes/root'))
app.use('/uploadImage', require('./routes/uploadImage'))

// --- RUN SERVER ---
app.listen(port, () => {
  console.log(`\nExample app listening on http://localhost:${port}/`)
})
