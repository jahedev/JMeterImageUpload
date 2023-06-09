require("dotenv").config()

const config = {
  fileupload: {
    useTempFiles: false, // saves RAM
    tempFileDir: "tmp/",
    safeFileNames: true,
    preserveExtension: true,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5 MiB
    },
    abortOnLimit: true,
    responseOnLimit: `
      <h1>400 - Bad Request<h2>
      <p>The file you are trying to upload is too large.</p>
    `,
  },
  session: {
    secret: "52fac80d8d257736ffcb7b71b4f925d1",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
    cookie: { secure: false },
  },
  customSettings: {
    useTestCaptcha: true,
    useS3Upload: process.env.USE_S3.toLowerCase().trim() == "true",
    uploadPath: "./fileStore",
  },
}

module.exports = config
