const MongoClient = require("mongodb");
var storage = require("node-persist");
var url = require("./config.js").mongoDBUrl;
const matchStage = {
  $match: { "fullDocument.device.celsiusTemperature": { $gt: 15 } }
};
const CS_TOKEN = "changeStreamResumeToken";

MongoClient.connect(url, (err, client) => {
  if (err) {
    console.warn(err);
    return;
  }

  const coll = client.db("demo").collection("devices");
  let changeStream = coll.watch([matchStage]);
  // const changeStream = coll.watch();

  storage.init({ dir: "localStorage" }).then(function() {
    if (true) {
      storage.getItem(CS_TOKEN).then(
        function(token) {
          if (token !== undefined) {
            console.log(`using resume token: ${JSON.stringify(token)}`);
            changeStream = coll.watch([matchStage], { resumeAfter: token });
          }
        },
        function(err) {
          console.log("error retrieving change stream resume token: " + err);
        }
      );
      pollStream(changeStream, storage);
    } else {
      changeStream.on("change", c => console.log(c));
    }
  });
});

function pollStream(cs, storage) {
  cs.next((err, change) => {
    if (err) return console.log(err);
    resumeToken = change._id;
    //resumeToken = change.documentKey._id;
    storage.setItem(CS_TOKEN, resumeToken).then(function() {
      console.log(change);
    });
    pollStream(cs, storage);
  });
}
