"use strict";

var aws = require("aws-sdk");
var Mustache = require("mustache");

exports.handler = function(event, context, callback) {
  console.log("Event: " + JSON.stringify(event));

  var input = JSON.parse(event.body);
  console.log("Data: " + JSON.stringify(input));

  var aws_region = process.env["AWS_DEFAULT_REGION"];
  if (aws_region == undefined) {
    aws_region = process.env["AWS_REGION_LOCAL"];
  }
  var s3_bucket = process.env["S3_BUCKET"];
  var from_address = process.env["FROM_ADDRESS"];

  aws.config.update({ region: aws_region });

  var config = require("./config.js");

  console.log(
    "Loading template from " + config.templateKey + " in " + s3_bucket
  );

  var s3 = new aws.S3();
  // Read the template file from S3
  s3.getObject(
    {
      Bucket: s3_bucket,
      Key: config.templateKey
    },
    function(err, data) {
      if (err) {
        // Error
        console.log(err, err.stack);
        context.fail("Internal Error: Failed to load template from s3.");
      } else {
        var templateBody = data.Body.toString();
        //templateBody = "<html><head><meta charset='utf-8' /><title>Change Stream Information</title></head><body><p>{{{.}}}</p></body></html>"

        //generate dynamic content based on Mustache tags
        var subject = Mustache.render(config.emailSubject, input);
        var message = Mustache.render(
          templateBody,
          JSON.stringify(input.fullDocument)
        );
        console.log(`subject: ${subject}`);
        console.log(`message: ${message}`);

        var params = {
          Destination: {
            ToAddresses: [config.toEmail]
          },
          Message: {
            Subject: {
              Data: subject,
              Charset: "UTF-8"
            }
          },
          Source: from_address,
          ReplyToAddresses: [from_address]
        };

        var fileExtension = config.templateKey.split(".").pop();
        if (fileExtension.toLowerCase() == "html") {
          params.Message.Body = {
            Html: {
              Data: message,
              Charset: "UTF-8"
            }
          };
        } else if (fileExtension.toLowerCase() == "txt") {
          params.Message.Body = {
            Text: {
              Data: message,
              Charset: "UTF-8"
            }
          };
        } else {
          context.fail(
            "Internal Error: Unrecognized template file extension: " +
              fileExtension
          );
          return;
        }

        var ses = new aws.SES();

        var response = {
          "statusCode": 200,
          "headers": {"Content-Type": "application/json"},
          "body": ""
        };

        // Send the email
        ses.sendEmail(params, function(err, data) {
          if (err) {
            console.log('Error sending an email ' + err, err.stack);
            response.statusCode = 502;
            response.body = `Internal Error: The email could not be sent: ${err.message}`;
            callback(null, response);
          } else {
            // successful response
            console.log(data);
            response.body =
              "The email was successfully sent to " + config.toEmail;
            callback(
              null,
              response
            );
          }
        });
      }
    }
  );
};
