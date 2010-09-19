var http = require('http');
var url = require('url');
var fs = require('fs');
var io = require('../socket.io-node/');
var sys = require('sys');
var httpProxy = require('http-proxy');
var engine = require('./engine');


//
// our base server will proxy any regular requests through
// to apache running behind it. only /socket.io/ requests
// will be handled specially.
//
// in this version i'm listening on 8080 and proxying to
// 80, but in real production you'd do it the other way
// around, so everything could run over 80 for maximum
// firewall goodness.
//

var server = http.createServer(function(req, res){

	var proxy = new httpProxy.HttpProxy(req, res);
	proxy.proxyRequest(80, 'localhost', req, res);
});
server.listen(8080);


//
// the game engine does the real work - it receives connections,
// disconnections and messages. it just has to decide what to do
// with them and maybe send some replies.
//

var engine = new engine.gameEngine();


//
// this is the socket.io server gubbins - it hijacks one path
// for client<->server comm.
//
	
var io = io.listen(server);

io.on('connection', function(client){

	engine.addPlayer(client);

	client.on('message', function(message){

		if (message.msg == 'ping'){
			client.send({msg: 'pong', t: message.t});
			return;
		}

		engine.playerMsg(client, message);
	});

	client.on('disconnect', function(){

		engine.removePlayer(client);
	});
});
