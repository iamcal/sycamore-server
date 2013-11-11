var http = require('http'),
	url = require('url'),
	fs = require('fs'),
	sys = require('sys'),
	httpProxy = require('http-proxy'),
	ws = require('ws');

var config = require('./config').config,
	engine = require('./lib/engine');


//
// the game engine does the real work - it receives connections,
// disconnections and messages. it just has to decide what to do
// with them and maybe send some replies.
//

var engine = new engine.gameEngine();


//
// the socket server, listening on an internal port
//

var socket_server = new ws.Server({port: 8081});
var client_ids = 1;

socket_server.on('connection', function(ws){

	console.log('socket connection');

	var client = new client_wrapper(socket_server, ws);

	engine.addSession(client);

	ws.on('message', function(message_raw){

		var message = JSON.parse(message_raw);

		if (message.msg == 'ping'){
			client.send({msg: 'pong', t: message.t});
			return;
		}

		console.log('socket message', message);

		engine.clientMsg(client, message);
	});

	ws.on('disconnect', function(){

		engine.removeSession(client);
	});
});

socket_server.on('error', function(ws){
	console.log('server error');
});

function client_wrapper(ss, ws){

	var self = this;
	this.ss = ss;
	this.ws = ws;
	this.sessionId = client_ids++;

	this.broadcast = function(data) {
		for (var i in self.ss.clients)
		self.ss.clients[i].send(data);
	};

	this.send = function(obj){
		self.ws.send(JSON.stringify(obj));
	}

	return this;
}



//
// the proxy server routes requests either to the web sockets (/socket),
// otherwise to apache
//

var proxy_server = httpProxy.createServer(function (req, res, proxy) {

	console.log('request - '+req.url);

	proxy.proxyRequest(req, res, {
		host: 'localhost',
		port: 8082
	});

}).listen(8080)

proxy_server.on('upgrade', function (req, socket, head) {

	console.log('upgrade - '+req.url);

	proxy_server.proxy.proxyWebSocketRequest(req, socket, head, {
		host: 'localhost',
		port: 8081
	});
});

