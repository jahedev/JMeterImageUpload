// AWS Imports
const {
  S3Client,
  ListBucketsCommand,
  PutObjectCommand,
} = require('@aws-sdk/client-s3')

// .env file configuration
require('dotenv').config()

const { S3_AWS_REGION, S3_BUCKET_NAME, S3_ACCESS, S3_SECRET } = process.env

// single S3 client
const client = new S3Client({
  region: S3_AWS_REGION,
  credentials: {
    accessKeyId: S3_ACCESS,
    secretAccessKey: S3_SECRET,
  },
})

// for debugging purposes
const listBuckets = async () => {
  const command = new ListBucketsCommand({})

  try {
    const { Owner, Buckets } = await client.send(command)
    console.log(
      `${Owner.DisplayName} owns ${Buckets.length} bucket${
        Buckets.length === 1 ? '' : 's'
      }:`
    )
    console.log(`${Buckets.map((b) => ` • ${b.Name}`).join('\n')}`)
  } catch (err) {
    console.error(err)
  }
}

// to upload images
const createObject = async (fileBody, key) => {
  const command = new PutObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: key,
    Body: fileBody,
  })

  try {
    const response = await client.send(command)
    console.log(response)
  } catch (err) {
    console.error(err)
  }
}

const getPresignedUrl = (key) => {
  const command = new PutObjectCommand({ Bucket: bucket, Key: key })
  return getSignedUrl(client, command, { expiresIn: 60 })
}

exports.client = client
exports.listBuckets = listBuckets
exports.createObject = createObject
