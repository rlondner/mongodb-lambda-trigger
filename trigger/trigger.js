var client = require("mongodb").MongoClient;
var config = require("./config.js");
var url = config.mongoDBUrl;
var awsApiKey = config.awsApiGWKey;
var apiGWUrl = config.awsApiGWUrl + "/sendemail";

var apigClientFactory = require("aws-api-gateway-client").default;
var apigClient = apigClientFactory.newClient({
  apiKey: awsApiKey,
  invokeUrl: apiGWUrl
});

const matchStage = {
  $match:{ 'fullDocument.device.celsiusTemperature': { $gt: 15 } }
};

client.connect(url, (err, client) => {
  if (err) throw err;

  var coll = client.db("demo").collection("devices");
  const changeStream = coll.watch([matchStage]);
  //const changeStream = coll.watch();

  changeStream.on('change', c => {
    console.log(`Change Stream: ${JSON.stringify(c)}`);

    apigClient
    .invokeApi({}, "", "POST", {}, c)
    .then(function(result) {
      console.log(result.data);
    })
    .catch(function(result) {
      console.log(result);
    });
  });

  if (false) {
    var cursor = coll.aggregate([{ $changeStream: {} }]);

    cursor.each(function(err, doc) {
      if (err) throw err;

      if (doc) {
        console.log(`Change Stream output: ${JSON.stringify(doc)}`);
        var method = "POST";
        var additionalParams = {
          //If there are any unmodeled query parameters or headers that need to be sent with the request you can add them here
          headers: {
            param0: "",
            param1: ""
          },
          queryParams: {
            param0: "",
            param1: ""
          }
        };
        var body = doc;

        apigClient
          .invokeApi({}, "", method, {}, body)
          .then(function(result) {
            console.log(result.data);
          })
          .catch(function(result) {
            console.log(result);
          });
      }
    });
  }
});
