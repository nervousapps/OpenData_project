'use strict';
const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient
, assert = require('assert');
const path = require('path');
const request = require('request');

var coordinate = [[48.1103, -1.68039],[48.1103, -1.68039]];

var url = 'mongodb://mongodb:27017/bus_data';

app.use('/MovingMarker.js', express.static(path.join(__dirname, '/MovingMarker.js')));
app.use('/index.js', express.static(path.join(__dirname, '/index.js')));
app.use('/icon/bus.png', express.static(path.join(__dirname, '/icon/bus.png')));

app.get('/', function (req, res) {
  console.log("Reached by client");
  res.sendFile(__dirname + "/index.html");
});

app.get('/data', function(req, res) {
    res.send(coordinate)
});

app.listen(3080, function(){
  console.log('listening on :3080');
});

// Request the data to the server and save them in the database
var data_request = function () {
  MongoClient.connect(url, function(err, db) {
    var cursor = db.collection('coordinates').find();
    // Execute the each command, triggers for each document
    cursor.each(function(err, item) {
        // If the item is null then the cursor is exhausted/empty and closed
        if(item == null) {
            db.close()
            return;
        }else{
          console.log("#################### item");
          console.log(item.coordinate);
          coordinate = item.coordinate;
        }
        // otherwise, do something with the item
    });
  });
  console.log(coordinate);
}
data_request()
setInterval(data_request, 10*1000)
