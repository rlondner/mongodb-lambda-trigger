var client = require("mongodb").MongoClient;
var url = require('./config.js').mongoDBUrl;

var docToInsert = {
  device: {
    name: "ecobee_1234",
    celsiusTemperature: 16,
    timeStamp: new Date()
  }
};

client.connect(url, (err, client) => {
  if (err) throw err;

  var coll = client.db('demo').collection("devices");
  coll.insertOne(docToInsert).then(res => {
    console.log(res.result)
    process.exit()
  }).catch(err => {
    console.error(err)
  })
});