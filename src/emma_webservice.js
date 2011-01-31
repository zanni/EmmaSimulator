require('../lib/json/json.js');
var fs = require('fs');
var model = require('./model/emma_model');
var Emma = model.Emma;


Emma.SIMULATOR = {};
Emma.SIMULATOR.host = "localhost";
Emma.SIMULATOR.port = 8080;


fs.readFile('topology.json','utf-8', function (err, data) {
	  	
  	var model = Emma.PARSER.parseNode(data);
  	
  	Emma.init(model);
  	
});


var display_handler = function(){
	console.log("[EmmaSimulator] - GET - /display");
	var result = "";
	result += "<div>";
	result += "<ol>";
	for(var i in Emma.root){
		result += "<li>"+Emma.root[i].ip+"</li>";
		if(Emma.root[i].resource.length > 0){
			result += "<ol>";
			for(var j in Emma.root[i].resource){
				result += "<li>"+Emma.root[i].resource[j].name+"</li>";
				result += "<ol>";
				result += "<li>"+JSON.stringify(Emma.root[i].resource[j].uri)+"</li>";
				result += "<li>"+JSON.stringify(Emma.root[i].resource[j].data)+"</li>";
				result += "<li>"+JSON.stringify(Emma.root[i].resource[j].meta)+"</li>";
				
				if(Emma.root[i].resource[j].log.length > 0){
					result += "<ol>";
					for(var k in Emma.root[i].resource[j].log){
						result += "<li>"+JSON.stringify(Emma.root[i].resource[j].log[k])+"</li>";
					}
					result += "</ol>";
				}
				result += "</ol>";
			}
			result += "</ol>";
		}
		
		
	}
	result += "</ol>";
	result += "</div>";
	return result;
};


var host_handler = function(host) {
	console.log("[EmmaSimulator] - GET - /node/"+host);
	var host = Emma.findHost(host);
	return Emma.PARSER.stringifyHost(host);
};
var resource_get_handler = function(host, resource){
	
	console.log("[EmmaSimulator] - GET - /node/"+host+"/"+resource);
	var host = Emma.findResource(host,resource);
	
	var model ={};
	model.message = [];
	model.message.push({fake:"fake"});
	model.message.push(Emma.PARSER.stringifyResource(host));
	return model;
};
var resource_put_handler = function(host, resource, body){
	console.log("[EmmaSimulator] - PUT - /node/"+host+"/"+resource);
	host = "{"+host+"}";
	
	var host = Emma.findResource(host,resource);
	var data = body;
	
	host[0].resource[0].data.value = data.value;
	
	var model ={};
	model.message = [];
	model.message.push({fake:"fake"});
	model.message.push(Emma.PARSER.stringifyResource(host));
	return model;
	
};


var log_handler = function(host, resource){
	console.log("[EmmaSimulator] - GET - /log/"+host+"/"+resource);
	var host = Emma.findResource(host,resource);

	
	var model ={};
	model.message = [];
	model.message.push({fake:"fake"});
	model.message.push(Emma.PARSER.stringifyLog(host));
	return model;
};
var express = require('express');
var app = express.createServer(
    express.bodyDecoder()
  );
app.get('/display', function(req, res){
	var response = display_handler();
    res.send(response);
});
app.get('/node/:host', function(req, res){
	var response = host_handler(req.params.host);
    res.send(response);
});
app.get('/node/:host/:resource', function(req, res){
	var response = resource_get_handler(req.params.host, req.params.resource);
    res.send(response);
});
app.put('/node/:host/:resource', function(req, res){

	var response = resource_put_handler(req.params.host, req.params.resource, req.body);
    res.send(response);
});
app.get('/log/:host/:resource', function(req, res){
	var response = log_handler(req.params.host, req.params.resource);
    res.send(response);
});
app.listen(Emma.SIMULATOR.port);
console.log("server running at "+Emma.SIMULATOR.host+" on "+Emma.SIMULATOR.port);