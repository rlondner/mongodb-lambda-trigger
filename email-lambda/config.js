"use strict";

var config = {
    templateKey : "Templates/ChangeStreamInfo.html",
    emailSubject: "MongoDB 3.6 Change Stream notification for {{fullDocument.device.name}}",
    toEmail: "<RECIPIENT_EMAIL_ADDRESS>"  
}

module.exports = config