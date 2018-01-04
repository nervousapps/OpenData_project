const request = require('request');
const MongoClient = require('mongodb').MongoClient
, assert = require('assert');

var json
var request_url = 'https://data.explore.star.fr/api/records/1.0/search/?dataset=tco-bus-vehicules-position-tr&facet=numerobus&facet=etat&facet=nomcourtligne&facet=sens&facet=destination&refine.nomcourtligne=C4&refine.sens=1'
// Connection URL
var url = 'mongodb://mongodb:27017/bus_data';

var coordinate = [[48.1103, -1.68039],[48.1103, -1.68039]];

//Use connect method to connect to the server and create a new collection
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Successfully connected to the database !")
  db.createCollection("coordinates", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    var myquery = {};
    db.collection("coordinates").insert(myquery, {coordinate}, function(err, res) {
      if (err) throw err;
      console.log("1 document updated");
    });
    db.close();
  });
  console.log("Successfully connected to the database !")
})

// Request the data to the server and save them in the database
var data_request = function () {
  request(request_url, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    json = JSON.parse(body)
    console.log(json.records[0].fields.coordonnees)
    if(coordinate[1] != json.records[0].fields.coordonnees){
      coordinate[0] = coordinate[1];
      coordinate[1] = json.records[0].fields.coordonnees;
      //Use connect method to connect to the server
      MongoClient.connect(url, function(err, db) {
        var myquery = {};
        db.collection("coordinates").updateOne(myquery, {coordinate}, function(err, res) {
          if (err) throw err;
          console.log("1 document updated");
          db.close();
        });
      });
    }
    console.log({coordinate})
  });
}
data_request()
setInterval(data_request, 30*1000)
