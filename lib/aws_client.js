// AWS Imports
const {
  S3Client,
  ListBucketsCommand,
  PutObjectCommand,
  GetObjectCommand,
} = require('@aws-sdk/client-s3')

const {
  S3RequestPresigner,
  getSignedUrl,
} = require('@aws-sdk/s3-request-presigner')
const { fromIni } = require('@aws-sdk/credential-providers')
const { parseUrl } = require('@aws-sdk/url-parser')
const { formatUrl } = require('@aws-sdk/util-format-url')
const { Hash } = require('@aws-sdk/hash-node')
const { HttpRequest } = require('@aws-sdk/protocol-http')

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
    return await getS3Url(key)
  } catch (err) {
    console.error(err)
  }
}

const createPresignedUrlWithoutClient = async ({ region, bucket, key }) => {
  const url = parseUrl(`https://${bucket}.s3.${region}.amazonaws.com/${key}`)
  const presigner = new S3RequestPresigner({
    credentials: fromIni(),
    region,
    sha256: Hash.bind(null, 'sha256'),
  })

  const signedUrlObject = await presigner.presign(new HttpRequest(url))
  return formatUrl(signedUrlObject)
}

const createPresignedUrlWithClient = ({ region, bucket, key }) => {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key })
  return getSignedUrl(client, command, { expiresIn: 3600 })
}

const getS3Url = async (key) => {
  const presignedS3Url = await createPresignedUrlWithClient({
    region: S3_AWS_REGION,
    bucket: S3_BUCKET_NAME,
    key: key,
  })

  return presignedS3Url
}

exports.client = client
exports.getS3Url = getS3Url
exports.listBuckets = listBuckets
exports.createObject = createObject
