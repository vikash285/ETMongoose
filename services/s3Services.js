const AWS = require('aws-sdk')

exports.uploadToS3 = (data, fileName) => {

    let s3bucket = new AWS.S3({
        accessKeyId: `${process.env.IAM_USER_KEY}`,
        secretAccessKey: `${process.env.IAM_USER_SECRET}`
        // Bucket: BUCKET_NAME
    })

        var params = {
            Bucket: `${process.env.BUCKET_NAME}`,
            Key: fileName,
            Body: data,
            ACL: 'public-read'
        }

        return new Promise((res, rej) => {
            s3bucket.upload(params, (err, s3response) => {
            if(err) {
                console.log('Something went wrong', err)
                rej(err)
            } else {
                console.log('Success', s3response)
                res(s3response.Location)
            }
        })
        })
}