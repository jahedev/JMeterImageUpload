const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3')

require('dotenv').config()

const { S3_AWS_REGION, S3_BUCKET_NAME, S3_ACCESS, S3_SECRET } = process.env

const client = new S3Client({
  region: S3_AWS_REGION,
  credentials: {
    accessKeyId: S3_ACCESS,
    secretAccessKey: S3_SECRET,
  },
})

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

exports.client = client
exports.listBuckets = listBuckets
