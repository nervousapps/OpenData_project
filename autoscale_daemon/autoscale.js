const request = require('request');
//const curl = require('node-curl')

var traefik_api = "http://loadbalancer:8080/health"

var orbiter_api = "http://orbiter:8000/handle/autoswarm/cluster_data_server"

var autoscaler = function(){
  request(traefik_api, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', JSON.parse(body).total_status_code_count)

    var tx = JSON.parse(body).total_status_code_count[200]/JSON.parse(body).total_count
    console.log("Taux : " + tx)

    if(JSON.parse(body).average_response_time_sec > 1.5 && JSON.parse(body).average_response_time_sec > 1.45){
      scale_up()
    }else if (JSON.parse(body).average_response_time_sec < 1 && tx > 0.9){
      scale_down()
    }

    if(tx < 0.9 && tx < 0.95){
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

setInterval(autoscaler, 2*1000)
