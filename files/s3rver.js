const fs = require("fs");
const S3rver = require("s3rver");
const cors = require('cors')

console.log("we are here");

new S3rver({
  port: 5000,
  address: "0.0.0.0",
  directory: "./s3",
  configureBuckets: [
    {
      name: "rs-file-storage",
      configs: [fs.readFileSync("./cors.xml")],
    },
  ],
}).run();