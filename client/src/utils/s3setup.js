const AWS = require('aws-sdk');

// Configure the AWS SDK to point to the local S3rver
const s3 = new AWS.S3({
  s3ForcePathStyle: true,
  accessKeyId: 'S3RVER', // These can be any values
  secretAccessKey: 'S3RVER',
  endpoint: new AWS.Endpoint('http://localhost:5000'),
});

const uploadFile =  async (file) => {
  const params = {
    Bucket: 'rs-file-storage', // Replace with your actual bucket name
    Key: file.name, // File name you want to save as in S3
    Body: file,
  };
  console.log(params.Bucket + "\n" + params.Key + "\n" + params.Body)
  await fetch("http://localhost:5000", {
    method: "POST",
    body: params,
  })
  // s3.upload(params, function(err, data) {
  //   if (err) {
  //     console.log(err);
  //     console.log('Failed to upload file.');
  //   } else {
  //     console.log(`File uploaded successfully. ${data.Location}`);
  //   }
  // });
};

module.exports = {s3, uploadFile}