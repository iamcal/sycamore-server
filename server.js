var http = require('http'), 
		url = require('url'),
		fs = require('fs'),
		io = require('../socket.io-node/'),
		sys = require('sys'),
		
server = http.createServer(function(req, res){
	// your normal server code
	var path = url.parse(req.url).pathname;
	switch (path){
		case '/':
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write('<h1>Welcome. Try the <a href="/chat.html">chat</a> example.</h1>');
			res.end();
			break;
			
		case '/json.js':
		case '/chat.html':
			fs.readFile(__dirname + path, function(err, data){
				if (err) return send404(res);
				res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html'})
				res.write(data, 'utf8');
				res.end();
			});
			break;
			
		default: send404(res);
	}
}),

send404 = function(res){
	res.writeHead(404);
	res.write('404');
	res.end();
};

server.listen(8080);
		
// socket.io, I choose you
// simplest chat application evar
var io = io.listen(server);
		
io.on('connection', function(client){
	client.send({ msg: 'hello' });
	client.broadcast({ announcement: client.sessionId + ' connected' });

	client.on('message', function(message){

		if (message.msg == 'ping'){
			client.send({msg: 'pong', t: message.t});
			return;
		}

		console.log('got a new message...');

		message.from = client.sessionId;

		client.send(message);
		client.broadcast(message);
	});

	client.on('disconnect', function(){
		client.broadcast({ announcement: client.sessionId + ' disconnected' });
	});
});
