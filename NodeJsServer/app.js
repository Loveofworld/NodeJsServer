
/**
 * Module dependencies.
 */

var lib_Express = require('express');
var lib_Http = require('http');
var lib_Path = require('path');

var lib_Querystring = require('querystring');
var lib_Request = require("request");
var lib_FormData = require('form-data');

var lib_MqttClient = require('./MqttClient.js');


var lib_SocketIO = require('socket.io').listen(5000);
lib_SocketIO.sockets.on('connection', function (socket) {
	socket.on('MQTT_Subscribe', function (obj_Param) {
		
		console.log("===== SocketIO : Connection : ", obj_Param.str_Topic);
		
		var obj_vMqttService = new lib_MqttClient.vMqttService("localhost", 1883);

		var str_Topic = obj_Param.str_Topic;
		
		var fun_OnEventReceived = function(str_Topic, str_Message, obj_Packet){
			console.log("==== str_Topic   : " + str_Topic);
			console.log("==== str_Message : " + str_Message);
			console.log("==== obj_Packet  : " , obj_Packet);
			
			var obj_Return = {
				  str_Topic   : str_Topic
				, str_Message : String(str_Message)
				, obj_Packet  : obj_Packet
			}
			
			lib_SocketIO.sockets.emit('MQTT_Received', obj_Return);
			  
		}	
		
		obj_vMqttService.fun_Subscribe(str_Topic, fun_OnEventReceived);
		
	});
});
 

var lib_Net = require('net');

// all environments
var obj_Application = lib_Express();

//obj_Application.set('views', __dirname + '/views');
//obj_Application.set('view engine', 'jade');
//obj_Application.use(obj_Application.router);
//obj_Application.use(obj_Express.static(path.join(__dirname, 'public')));

obj_Application.set('port', process.env.PORT || 3000);
obj_Application.use(lib_Express.favicon());
obj_Application.use(lib_Express.logger('dev'));
obj_Application.use(lib_Express.bodyParser());
obj_Application.use(lib_Express.methodOverride());

// development only : io js
if ('development' == obj_Application.get('env')) {
	obj_Application.use(lib_Express.errorHandler());
}

obj_Application.all('*', function(obj_Request, obj_Response, fun_Next) {
	obj_Response.header("Access-Control-Allow-Origin", "*");
	obj_Response.header("Access-Control-Allow-Headers", "X-Requested-With");
	fun_Next();
});


obj_Application.post('/cors_post.do', function (obj_Request, obj_Response) {
	
	console.log("cors_post.do : " + obj_Request.body.request_url);
	console.log(obj_Request.body.param);
	
	var headers = {
	    //'User-Agent':       'Super Agent/0.0.1',
		'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
		'Accept':'application/json, text/javascript, */*; q=0.01',
	}
	
	
	var request_options = {
	    url: obj_Request.body.request_url,
	    method: 'POST',
	    headers: headers,
	    qs:  JSON.parse(obj_Request.body.param)
	}
	
	lib_Request(request_options, function(obj_Error, obj_ResponseData, obj_Body) {
		console.log("error : " + obj_Error);
		obj_Response.header("Access-Control-Allow-Origin", "*");
		obj_Response.header("Access-Control-Allow-Headers", "X-Requested-With");
		obj_Response.send({"error":obj_Error, "response" : obj_ResponseData});
	});
	
});



obj_Application.post('/cors_form.do', function (obj_Request, obj_Response) {
	
	console.log("cors_post.do : " + obj_Request.body.request_url);
	console.log(obj_Request.body.param);
	
	var obj_FormData = lib_Querystring.stringify(eval("("+obj_Request.body.param+")"));
	var num_ContentLength = formData.length;
	
	console.log(obj_FormData);
	
	var obj_Headers = {
		    //'User-Agent':       'Super Agent/0.0.1',
			'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
			'Accept':'application/json, text/javascript, */*; q=0.01',
			'Content-Length': num_ContentLength,
	}
	
	var obj_RequestOptions = {
		    url: obj_Request.body.request_url,
		    method: 'POST',
		    headers: headers,
		    body: obj_FormData,
	}
	
	lib_Request(obj_RequestOptions, function(obj_Error, obj_ResponseData, body) {
		  console.log("error : " + obj_Error);
		  obj_Response.header("Access-Control-Allow-Origin", "*");
		  obj_Response.header("Access-Control-Allow-Headers", "X-Requested-With");
		  obj_Response.send({"error":obj_Error, "response" : obj_ResponseData});
	});
	
});



obj_Application.post('/cors_get.do', function (obj_Request, obj_Response) {
	
	console.log("cors_get.do : " + obj_Request.body.request_url);
	console.log(obj_Request.body.param);
	
	var obj_Headers = {
		    //'User-Agent':       'Super Agent/0.0.1',
		    //'Content-Type':     'application/x-www-form-urlencoded'
		    'Content-Type':	'application/x-www-form-urlencoded; charset=UTF-8'
	}
	
	var obj_RequestOptions = {
		    url: obj_Request.body.request_url,
		    method: 'GET',
		    headers: headers,
		    qs:  JSON.parse(obj_Request.body.param)
	}
	
	lib_Request(obj_RequestOptions, function(obj_Error, obj_ResponseData, obj_Body) {
		  console.log("error : " + obj_Error);
		  obj_Response.header("Access-Control-Allow-Origin", "*");
		  obj_Response.header("Access-Control-Allow-Headers", "X-Requested-With");
		  obj_Response.send({"error":obj_Error, "response" : obj_ResponseData});
	});
	
});


lib_Http.createServer(obj_Application).listen(obj_Application.get('port'), function(){
	console.log('Express server listening on port ' + obj_Application.get('port'));
});
