const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { response, request } = require("express");
admin.initializeApp(functions.config().firebase);
var db = admin.database();

exports.getFarmData = functions.https.onRequest(async (request, response) => {
  const farmID = request.query.farmID;
  const topic = request.query.topic;

  if (request.method === "GET") {
    if (topic === "lux") {
      var lux_ref = db.ref(farmID + "/lux");
      lux_ref.limitToLast(1).on("child_added", (data) => {
        response.send(JSON.stringify(data.val()));
      });
    }
    if (topic === "environment") {
      var envi_ref = db.ref(farmID + "/environment");
      envi_ref.limitToLast(1).on("child_added", (data) => {
        response.send(JSON.stringify(data.val()));
      });
    }
    if (topic === "allEnvironment") {
      var allenvi_ref = db.ref(farmID + "/environment");
      allenvi_ref.once("value", (data) => {
        response.send(JSON.stringify(data.val()));
      });
    }
    if (topic === "water") {
      var water_ref = db.ref(farmID + "/water");
      water_ref.limitToLast(1).on("child_added", (data) => {
        response.send(JSON.stringify(data.val()));
      });
    }
    if (topic === "info") {
      var info_ref = db.ref(farmID + "/information");
      info_ref.once("value", (data) => {
        response.send(JSON.stringify(data.val()));
      });
    }
    if (topic === "location") {
      var location_ref = db.ref(farmID + "/location");
      location_ref.once("value", (data) => {
        response.send(JSON.stringify(data.val()));
      });
    }
  }
});

exports.saveLocation = functions.https.onRequest(async (request, response) => {
  const farmID = request.query.farmID;
  let lat = request.body.lat;
  let long = request.body.long;

  if (request.method === "PUT") {
    var location_ref = db.ref(farmID + "/location");
    await location_ref.update(
      {
        lat: lat,
        long: long,
      },
      (error) => {
        if (error) {
          response.send({ msg: "ERROR: " + error });
        } else {
          response.send({ msg: "UPDATED LAT: " + lat + " LONG: " + long });
          // response.send(JSON.stringify(request.body));
        }
      }
    );
  } else {
    response.send({ msg: "Invalid Method" });
  }
});

exports.saveFarmInformation = functions.https.onRequest(
  async (request, response) => {
    const topic = request.query.topic;
    const farmID = request.query.farmID;
    let farmName = request.body.farmName;
    let owner = request.body.owner;
    let staff = request.body.staff;
    if (request.method === "PUT") {
      if (topic === "setFarmID") {
        var database_ref = db.ref(farmID);
        await database_ref.set(
          {
            information: {
              farmID: farmID,
              farmName: "",
              owner: "",
              staff: [""],
            },
          },
          (error) => {
            if (error) {
              response.send({ msg: "ERROR: " + error });
            } else {
              response.send({
                msg: "SET FARM ID:  " + farmID,
              });
            }
          }
        );
      } else if (topic === "updateFarmInfo") {
        var info_ref = db.ref(farmID + "/information");
        await info_ref.update(
          {
            farmName: farmName,
            owner: owner,
            staff: staff,
          },
          (error) => {
            if (error) {
              response.send({ msg: "ERROR: " + error });
            } else {
              response.send({
                msg: "UPDATED FARM INFORMATION FARM ID:  " + farmID,
              });
            }
          }
        );
      }
    }
  }
);

exports.deleteFarmdata = functions.https.onRequest(
  async (request, response) => {
    const farmID = request.query.farmID;
    var database_ref = db.ref(farmID);
    await database_ref.remove();
    response.send({ msg: "DELETED" });
  }
);
