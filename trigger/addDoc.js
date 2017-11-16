var client = require("mongodb").MongoClient;
var url = require('./config.js').mongoDBUrl;

var docToInsert = {
  device: {
    name: "ecobee_1234",
    celsiusTemperature: 14,
    timeStamp: new Date()
  }
};

client.connect(url, function(err, db) {
  if (err) throw err;

  var coll = db.collection("devices");
  coll.insertOne(docToInsert).then(res => {
    console.log(res.result)
    process.exit()
  }).catch(err => {
    console.error(err)
  })
});
