'use strict';
const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient
, assert = require('assert');
const path = require('path');

var url = 'mongodb://mongodb:27017/bus_data';

app.use('/MovingMarker.js', express.static(path.join(__dirname, '/MovingMarker.js')));

app.get('/', function (req, res) {
  console.log("Reached by client");
  res.sendFile(__dirname + "/index.html");
});

app.get('/data', function(req, res) {
  var getData = function(){
    MongoClient.connect(url, function(err, db) {
      db.collection("coordinates").find(function(err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(docs.records[0].fields.coordonnees);
        res.send(docs.records[0].fields.coordonnees);
      });
    });
  }
  setInterval(getData, 30*1000)
  res.send("Yalla");
});

app.listen(3080, function(){
  console.log('listening on :3080');
});
