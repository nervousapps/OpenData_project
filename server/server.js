'use strict';
const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient
, assert = require('assert');
const path = require('path');

var url = 'mongodb://mongodb:27017/bus_data';

app.use('/MovingMarker.js', express.static(path.join(__dirname, '/MovingMarker.js')));

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get('/data', function(req, res) {
  MongoClient.connect(url, function(err, db) {
    db.collection("busline").find(function(err, docs) {
      assert.equal(err, null);
      console.log("Found the following records");
      console.log(docs.records[0].fields.coordonnees);
      res.send(docs);
    });
  });
});

app.listen(8080, function(){
  console.log('listening on :8080');
});
