"use strict";

var config = {
    mongoDBUrl : "mongodb://localhost:27017,localhost:27018,localhost:27019/demo?replicaSet=rs",
    awsApiGWKey : "<API_GATEWAY_APIKEY>",
    awsApiGWUrl: "https://<PREFIX>.execute-api.us-east-1.amazonaws.com/Stage",
    emailSubject: "MongoDB 3.6 Change Stream notification"
}

module.exports = config