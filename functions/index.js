const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
var db = admin.database();

exports.getFarmData = functions.https.onRequest((request, response) => {
  const farmID = request.query.farmID;
  if (request.method === "GET") {
    var ref = db.ref(farmID);
    ref.limitToLast(1).on("child_added", (snapshot) => {
      response.send(JSON.stringify(snapshot.val()));
    });
  }
});

exports.getAll = functions.https.onRequest((request, response) => {
  if (request.method === "GET") {
    var ref = db.ref();
    ref.once("value", (snapshot) => {
      response.send(JSON.stringify(snapshot.val()));
    });
  }
});
