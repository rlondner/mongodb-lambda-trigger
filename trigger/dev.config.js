"use strict";

var config = {
    mongoDBUrl : "mongodb://localhost:27017,localhost:27018,localhost:27019/demo?replicaSet=rs",
    awsApiGWKey : "iS675yiOYA1g6O783WF5f8u03XYEvRdj7z9snJfX",
    awsApiGWUrl: "https://ciwqx6i5la.execute-api.us-east-1.amazonaws.com/Stage",
    emailSubject: "MongoDB 3.6 Change Stream notification"
}

module.exports = config