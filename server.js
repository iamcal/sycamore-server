var http = require('http');
var url = require('url');
var fs = require('fs');
var io = require('../socket.io-node/');
var sys = require('sys');
var httpProxy = require('http-proxy');


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
// this is the socket.io server gubbins - it hijacks one path
// for client<->server comm. in the near future, this will hook
// into the actual game server instead of just echoing things.
//
	
var io = io.listen(server);
		
io.on('connection', function(client){
	client.send({ msg: 'hello' });

	client.broadcast({ announcement: client.sessionId + ' connected' });

	client.on('message', function(message){

		if (message.msg == 'ping'){
			client.send({msg: 'pong', t: message.t});
			return;
		}

		message.from = client.sessionId;

		console.log('recv: '+sys.inspect(message));

		client.send(message);
		client.broadcast(message);
	});

	client.on('disconnect', function(){
		client.broadcast({ announcement: client.sessionId + ' disconnected' });
	});
});
