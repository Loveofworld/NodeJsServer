var lib_Mqtt = require('mqtt');
var lib_Url = require('url');

function vMqttService(str_Hostname, num_Port, obj_Option){
	
	this.obj_MqttUrl = lib_Url.parse("mqtt://"+str_Hostname+":"+num_Port);
	this.obj_Option  = obj_Option;
	
	/*
	this.obj_MqttClient = lib_Mqtt.createClient(obj_MqttUrl.port, obj_MqttUrl.hostname);
	this.obj_MqttClient.on('connect', function() { // When connected

		obj_Client.subscribe(str_Topic, function() {
			// when a message arrives, do something with it
			obj_Client.on('message', function(topic, message, packet) {
				console.log("Received '" + message + "' on '" + topic + "'");
			});
		});
		
		// publish a message to a topic
		obj_Client.publish(str_Topic, 'my message', function() {
			console.log("Message is published");
			obj_Client.end(); // Close the connection when published
		});
	});
	*/
	
};
exports.vMqttService = vMqttService;

vMqttService.prototype.obj_MqttUrl = null;
vMqttService.prototype.obj_Option = null;

vMqttService.prototype.fun_SetMqttClient = function(obj_MqttClient){
	this.obj_MqttClient = obj_MqttClient;
	
};

vMqttService.prototype.fun_GetMqttClient = function(){
	return this.obj_MqttClient;
	
};



vMqttService.prototype.fun_Subscribe = function(str_ClientId, fun_OnEventReceived){
	
	var obj_MqttClient = lib_Mqtt.createClient(this.obj_MqttUrl.port, this.obj_MqttUrl.hostname);
	obj_MqttClient.on('connect', function() { // When connected

		obj_MqttClient.subscribe(str_ClientId, function() {
			// when a message arrives, do something with it
			obj_MqttClient.on('message', function(topic, message, packet) {
				console.log("Received '" + message + "' on '" + topic + "'");
				fun_OnEventReceived(topic, message, packet);
			});
		});
	});
	
};


vMqttService.prototype.fun_Publish = function(str_ClientId, str_Message){
	this.fun_GetMqttClient().publish(str_ClientId, str_Message, function() {
		console.log("Message is published");
		//obj_Client.end(); // Close the connection when published
	});
	
	var obj_MqttClient = lib_Mqtt.createClient(this.obj_MqttUrl.port, this.obj_MqttUrl.hostname);
	obj_MqttClient.on('connect', function() { // When connected

		obj_MqttClient.publish(str_ClientId, str_Message, function() {
			console.log("Message is published");
			obj_MqttClient.end(); // Close the connection when published
		});
	});
	
};
