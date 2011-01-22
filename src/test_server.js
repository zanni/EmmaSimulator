var http = require('http');
var fs = require('fs');

require('../lib/json/json.js');

var model = require('./model/emma_model');
var Emma = model.Emma;


Emma.SIMULATOR = {};
Emma.SIMULATOR.host = "localhost";
Emma.SIMULATOR.port = 8080;

Emma.SIMULATOR.root = [];

fs.readFile('topology.json','utf-8', function (err, data) {
	  	
  	var hosts = Emma.PARSER.parseNode(data);
  	
  	Emma.SIMULATOR.root = hosts;
  	
  	console.log(JSON.stringify(Emma.SIMULATOR.root));
});

http.createServer(function (req, res) {
	
  
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
  
  
  
}).listen(Emma.SIMULATOR.port, Emma.SIMULATOR.host);

console.log("server launched ");