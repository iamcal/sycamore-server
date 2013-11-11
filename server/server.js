var http = require('http'),
	url = require('url'),
	fs = require('fs'),
	io = require('socket.io'),
	sys = require('sys'),
	express = require('express');

var config = require('./config').config,
	engine = require('./lib/engine');


// express app is the top level server
var app = express();
app.use(express.static(__dirname + "/../client"));

// create server on port 80
var server = http.createServer(app);
server.listen(80);


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

io.sockets.on('connection', function(client){

	console.log('got client connection');

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
