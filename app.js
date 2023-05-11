const express = require('express')
const app = express()
const pug = require('pug')
const bodyParser = require('body-parser')
var fileupload = require('express-fileupload')
const port = 3000

// --- MIDDLEWARE ---
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(
  fileupload({
    useTempFiles: true,
    tempFileDir: 'tmp/',
    safeFileNames: true,
  })
)
app.set('view engine', 'pug')

// --- ROUTES ---
app.use('/', require('./routes/root'))
app.use('/uploadImage', require('./routes/uploadImage'))

// --- RUN SERVER ---
app.listen(port, () => {
  console.log(`\nExample app listening on http://localhost:${port}/`)
})
