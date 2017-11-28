const request = require('request');
const MongoClient = require('mongodb').MongoClient
, assert = require('assert');

var json
var request_url = 'https://data.rennesmetropole.fr/api/records/1.0/search/?dataset=parcours-des-lignes-de-bus-du-reseau-star&facet=nomcourtligne&facet=senscommercial&facet=nomarretdepart&facet=nomarretarrivee&facet=estaccessiblepmr&refine.nomcourtligne=C4'
// Connection URL
var url = 'mongodb://mongodb:27017/bus_data';

//Use connect method to connect to the server and create a new collection
MongoClient.connect(url, function(err, db) {
  db.createCollection("busline", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
  console.log("Successfullyconnected to the database !")
})

// Request the data to the server and save them in the database
var data_request = function () {
  request(request_url, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    json = body
    console.log('Bus C4 : ' + JSON.parse(json).records[0].fields.coordonnees)
    //Use connect method to connect to the server
    MongoClient.connect(url, function(err, db) {
      var myquery = {};
      var newvalues = JSON.parse(json);
      db.collection("busline").updateOne(myquery, newvalues, function(err, res) {
        if (err) throw err;
        console.log("1 document updated");
        db.close();
      });
    });
  });
}
//setInterval(data_request, 10*1000)
data_request();
