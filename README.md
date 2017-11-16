# MongoDB 3.6 Change Streams - AWS Lambda demo

This repository demonstrates how to use MongoDB Change Streams as a trigger to an AWS Lambda function.

## AWS Lambda function

This is the Lambda function used to send an email from a MongoDB Change Stream notification

### Configuration

1. In AWS, create an S3 bucket, create a `Templates` folder and upload the [ChangeStreamInfo.html](./email-lambda/Templates/ChangeStreamInfo.html) file into it.
1. In AWS, configure SES with (at least) 2 verified email addresses (one will be used to send the email, the other to receive the email)
1. In `sam.yaml`, customize
    - the `S3_BUCKET` environment variable with the value of your S3 bucket
    - the `FROM_ADDRESS` environment variable with the value of the first SES-verified email address
1. In [config.js](./email-lambda/config.js) set the `toEmail` property to your other SES-verified email address

### Test

1. Install [SAM Local](https://github.com/awslabs/aws-sam-local#installation) on your machine
1. In the __email-lambda__ folder, run `npm install` to install the required Node dependencies
1. Run `sh invoke.sh` from Terminal to test your Lambda function local

### Deployment

1. Run `sh package.sh` from Terminal to package your SAM package
1. Run `sh deploy.sh` from Terminal to deploy your SAM package to AWS
1. Once the script has completed (without errors), sign in into the AWS Console
1. Navigate to the IAM service, edit the `ChangeStream-SendEmail-SendEmailRole-[random]` role
1. Add 2 inline policies
    - For Amazon S3, add the `GetObject` policy on the `*` ARN
    - For Amazon SES, add the `SendEmail` policy
1. Test that the `SendEmail` lambda function works correctly (you can use the `event.json` file as a test event).
1. Navigate to the __API Gateway__ console and select __API Keys__. Create an API Key and copy the value to the `awsApiGWKey` property of the [trigger/config.js](./trigger/config.js) file.
1. Select the __ChangeStream-SendEmail__ API and in the Actions menu, select _Deploy API_ for the __Stage__ deployment stage.
1. In the _ChangeStream-SendEmail/Stages_ menu, select the _Stage_ stage and copy the __Invoke URL__ value. Copy it to the `awsApiGWUrl` property of the [trigger/config.js](./trigger/config.js) file.

## MongoDB 3.6 cluster configuration

You must configure a replica set for change streams to work. Follow the instructions below:

1. Make sure the latest version of [mtools](https://github.com/rueckstiess/mtools/blob/develop/INSTALL.md) is installed on your machine
1. In the __*trigger*__ folder, edit [setup.sh](./trigger/setup.sh) and update the MONGO_LOCATION variable to point to your local MongoDB 3.6 installation root
1. Run `sh setup.sh` to set up your MongoDB 3.6 replica set using mlaunch
1. Run `sh run.sh` to start your MongoDB 3.6 replica

## AWS Lambda trigger configuration (with Change Streams)

1. In the __trigger__ folder, run `npm install` to install the required Node dependencies
1. Run `node trigger.js` to start listening to change streams coming from the _devices_ collection of the _demo_ database.
1. In a separate Terminal window, run `node addDoc.js` - this will add a document to the `devices` collection of the `demo` database.
1. Look at the window running `trigger.js` and if everything was properly configured you should get a *Change Stream output* log message, followed by a message confirming that the email was successfully sent.
1. Check your email inbox and you should find an email titled _MongoDB 3.6 Change Stream notification for ecobee_1234_.