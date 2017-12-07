const request = require('request');
//const curl = require('node-curl')

var traefik_api = "http://loadbalancer:8080/health"

var orbiter_api = "http://orbiter:8000/handle/autoswarm/cluster_data_server"

var autoscaler = function(){
  request(traefik_api, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', JSON.parse(body))
    if(JSON.parse(body).average_response_time_sec > 0.8){
      scale_up()
    }
  });
}

var scale_up = function(){
  request.post(orbiter_api).form('{"direction":true}')
  console.log("Scale up !")
}

var scale_down = function(){
  request.post(orbiter_api).form('{"direction":false}')
  console.log("Scale down !")
}

setInterval(autoscaler, 1*1000)
