const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
var db = admin.database();

exports.getFarmData = functions.https.onRequest((request, response) => {
  const farmID = request.query.farmID;
  const topic = request.query.topic;
  if (request.method === "GET") {
    if (topic === "environment") {
      var envi_ref = db.ref(farmID + "/environment");
      envi_ref.limitToLast(1).on("child_added", (snapshot) => {
        response.send(JSON.stringify(snapshot.val()));
      });
    }
    if (topic === "water") {
      var water_ref = db.ref(farmID + "/water");
      water_ref.limitToLast(1).on("child_added", (snapshot) => {
        response.send(JSON.stringify(snapshot.val()));
      });
    }
    if (topic === "info") {
      var info_ref = db.ref(farmID + "/information");
      info_ref.once("value", (snapshot) => {
        response.send(JSON.stringify(snapshot.val()));
      });
    }
  }
});
