//
// server connection and message/event handling logic
//


function serverConnection(config){

	var self = this;

	this.config = config;
	this.online = false;
	this.pingTimer = null;
	this.giveupTimer = null;
	this.lastConnected = 0;
	this.eventHandlers = {};

	this.socket = new io.Socket(config.host, {
		port: config.port
		//transports: ['xhr-polling']
	});


	//
	// set up event handlers on the socket object
	//

	this.socket.on('connect', function(){

		self.lastConnected = new Date().getTime();

		self.emit('connected');
		self.emit('state', 'connected');
	});

	this.socket.on('close', function(){
		//console.log('closed');
	});

	this.socket.on('disconnect', function(){

		self.emit('disconnected');
		self.emit('state', 'disconnected');

		// if we get disconnected, we will immediately
		// try to reconnect. if we went offline on purpose,
		// self.online will be false so reconnect() will
		// just no-op.

		self.reconnect();
	});

	this.socket.on('message', function(data){

		if (data.msg == 'pong'){
			if (!self.socket.connected) return;
			var diff = (new Date().getTime()) - data.t;
			if (diff < 0) diff = 0;
			self.emit('state', 'connected', diff);
			//console.log('lag: '+diff);
			return;
		}

		self.emit('message', data);
	});


	//
	// event handlers
	//

	this.on = function(ev, f){
		if (!self.eventHandlers[ev]){
			self.eventHandlers[ev] = [];
		}
		self.eventHandlers[ev].push(f);
	};

	this.emit = function(){
		var args = Array.prototype.slice.call(arguments);
		var ev = args.shift();
		if (self.eventHandlers[ev]){
			for (var i=0; i<self.eventHandlers[ev].length; i++){
				var f = self.eventHandlers[ev][i];
				f.apply(self, args);
			}
		}
	};


	//
	// the real guts
	//

	this.brace_for_failure = function(){

		// this timer is set up so that we can decide to just stop trying
		// after a certain period.

		if (self.giveupTimer) window.clearTimeout(self.giveupTimer);
		self.giveupTimer = window.setTimeout(function(){ self.giveup(); }, self.config.giveup_interval);
	};

	this.connect = function(){
		self.online = true;
		self.emit('state', 'connecting');

		self.brace_for_failure();
		self.socket.connect();
	};

	this.reconnect = function(){
		if (!self.online) return;
		self.emit('state', 'reconnecting');

		self.brace_for_failure();
		self.socket.connect();
	};

	this.giveup = function(){
		window.clearTimeout(self.giveupTimer);
		self.giveupTimer = null;
		if (self.socket.connected) return;

		self.emit('state', 'disconnected');
	};


	//
	// ping is a simple interval - if we're connected, send
	// a ping message. if not, do nothing
	//

	self.pingTimer = window.setInterval(function(){
		if (self.socket.connected){
			self.socket.send({msg: 'ping', t: new Date().getTime()});
		}
	}, self.config.ping_interval);


	//
	// toggle the client on and off
	//

	this.go_online = function(){
		if (self.socket.connected) return;
		self.online = true;
		self.reconnect();
	};

	this.go_offline = function(){
		self.online = false;
		if (self.socket.connected) self.socket.disconnect();
	};


	//
	// send a message
	//

	this.send = function(msg){
		self.socket.send(msg);
	};


	// delay this call so that the caller can set up event handlers
	window.setTimeout(function(){ self.connect(); }, 0);
}

//
// let us begin
//

var con;

function engine_start(){

	init_tiles();
	//return;


	//
	// connect to the game server
	//

	con = new serverConnection({
		host		: g_config.server_host,
		port		: g_config.server_port,
		ping_interval	: 3000,
		giveup_interval	: 10000
	});
	
	
	//
	// these are our connection state handlers
	//

	con.on('state', function(state, lag){
		switch (state){
			case 'connected':
				$('#con').addClass('online').removeClass('offline');
				$('#lag').text(lag ? lag+'ms' : 'Connected');
				break;

			case 'disconnected':
				$('#con').removeClass('online').addClass('offline');
				$('#lag').text('Disconnected');
				break;

			case 'connecting':
				$('#con').removeClass('online').removeClass('offline');
				$('#lag').text('Connecting...');
				break;

			case 'reconnecting':
				$('#con').removeClass('online').removeClass('offline');
				$('#lag').text('Reconnecting...');
				break;

			default:
				$('#con').removeClass('online').removeClass('offline');
				$('#lag').text('Unknown: '+state);
		}
	});


	//
	// these are our message handlers
	//

	con.on('message', function(msg){

		console.log('got a message!', msg);

		switch (msg.msg){
			case 'welcome': return handleWelcome(msg);
			case 'joined': return handleJoined(msg);
			case 'left': return handleLeft(msg);
			case 'move': return handleMoved(msg);
		}

		console.log('unhandled message', msg);
	});

	con.on('connected', function(){

		//con.send({msg: 'some data'});
	});
};

///////////////////////////////////////////////

//
// we have connected. populate player list
// this includes us!
//

function handleWelcome(msg){
	$('#onlinelistplayers').html('');
	$('#playarea').html('');

	for (var i in msg.players){
		addPlayer(i, msg.players[i]);
	}
}

var players = {};

function addPlayer(uid, p){

	var txt = uid;
	if (p.self) txt += " (you)";
	var d = $('<div>').text(txt);
	d.attr('id', 'players-'+uid);
	$('#onlinelistplayers').append(d);


	players[uid] = new player(uid, p.self, p.state);
}

//
// another player joined
//

function handleJoined(msg){
	addPlayer(msg.uid, msg.player);
}

//
// another player left
//

function handleLeft(msg){
	$('#players-'+msg.uid).remove();

	delete players[msg.uid];
}

//
// a player moved. it could be us!
//

function handleMoved(msg){

	players[msg.uid].update_state(msg.state);
}

scriptLoaded('net');