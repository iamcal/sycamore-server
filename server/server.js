var http = require('http'),
	url = require('url'),
	fs = require('fs'),
	io = require('../socket.io-node/'),
	sys = require('sys'),
	httpProxy = require('http-proxy');

var config = require('./config').config,
	engine = require('./lib/engine');


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
	proxy.proxyRequest(config.proxy_port, config.proxy_address, req, res);
});
server.listen(config.listen_port);


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

	engine.addSession(client);

	client.on('message', function(message){

		if (message.msg == 'ping'){
			client.send({msg: 'pong', t: message.t});
			return;
		}

		engine.clientMsg(client, message);
	});

	client.on('disconnect', function(){

		engine.removeSession(client);
	});
});
