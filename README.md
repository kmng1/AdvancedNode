# AdvancedNodeStarter
Starting project for a course on Advanced Node @ Udemy

## Changes
Install nodemon and concurrently globally, remove form package.json   
`npm install -g concurrently nodemon`

## Redis
Redis server `https://github.com/MicrosoftArchive/redis/releases`   
Documentation: `https://www.npmjs.com/package/redis`
   
## Test
Jest: `https://facebook.github.io/jest/`   
Puppeteer: `https://github.com/googlechrome/puppeteer`   
safe-buffer: `https://www.npmjs.com/package/safe-buffer`   
keygrip: `https://www.npmjs.com/package/keygrip`

## CI
YAML Converter: `https://codebeautify.org/yaml-to-json-xml-csv`    
Travis CI: `https://docs.travis-ci.com/user/database-setup/`

## AWS S3
[AWS SDK for JavaScript in Node.JS](https://aws.amazon.com/sdk-for-node-js/)

### S3 bucket policy from Policy geneator
            "Sid": "Stmt1522205245106",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::s3-blog1/*"

### S3 bucket CORS configuration
Add rule after default rule
<CORSRule>
    <AllowedOrigin>http://localhost:3000</AllowedOrigin>
    <AllowedMethod>PUT</AllowedMethod>
    <MaxAgeSeconds>3000</MaxAgeSeconds>
    <AllowedHeader>*</AllowedHeader>
</CORSRule>

### IAM User Policy to upload to S3 bucket
Create s3-blog user and attach s3-blog policy
Service: S3
Actions: All S3 actions
Resources:
  bucket: s3-blog1
  object: s3-blog1/*

