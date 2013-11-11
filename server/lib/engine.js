// Everything we need to get this done
var util = require('./util').util,
	Player = require('./player').Player,
	NPC = require('./npc').NPC,
	Item = require('./item').Item;

// The game engine
exports.gameEngine = function(){

	var self = this;

	this.sessions = {};
	this.players = {};
	this.map = require('../game/map1'); // this is a hack


	//
	// add a newly-connected session
	//
	
	this.addSession = function(client){

		console.log(client.sessionId+': session connected');

		// create a new client record.
		// we wont create their player object until
		// they log in.

		self.sessions[client.sessionId] = {
			started: new Date().getTime(),
			player_id: 0,
			player: null,
		};
	};


	//
	// remove a session from the world (disconnect, etc)
	//
	
	this.removeSession = function(client){

		console.log(client.sessionId+': session disconnected');

		var session = self.sessions[client.sessionId];

		if (session.player){
			// tell all the OTHER players about it
			client.broadcast({msg: 'left', uid: session.player.uid});

			self.players[session.player.uid].cleanup();
			delete self.players[session.player.uid];
		}

		delete self.sessions[client.sessionId];
	};


	//
	// handle player commands from the client
	//
	
	this.clientMsg = function(client, msg){

		var session = self.sessions[client.sessionId];


		//
		// if the session has a player attached, let the player handle it
		//

		if (session.player){

			// move to x,y
			if (msg.msg == 'move'){
				session.player.move(msg.x, msg.y);
				return;
			}

			console.log("unhandled message from player: "+msg.msg);
			client.send({msg: 'unhandled', src: msg});
			return;
		}


		//
		// a non-player message (perhaps a login)
		//

		if (msg.msg == 'login'){
			if (!msg.player_id){
				console.log('ERROR: login without player id');
				return;
			}

			self.createPlayer(client, msg.player_id);
			return;
		}

		console.log("unhandled message from session: "+msg.msg);
		client.send({msg: 'unhandled', src: msg});
	};


	//
	// upgrade a session to a player
	//

	this.createPlayer = function(client, player_id){

		// check they don't already have a player attached
		// to this session.

		if (this.sessions[client.sessionId].player_id){
			console.log('ERROR: trying to recreate player for a session');
			return;
		}

		console.log(client.sessionId+': player logged in');


		// do we need to force a disconnect because the
		// player has an existing session?

		if (this.players[player_id]){

			// send the origin session a disconnect message
			var other_client = this.players[player_id].client;
			other_client.send({msg: 'disconnect', reason: 'Logged in elsewhere'});

			console.log(client.sessionId+': disconnecting old session '+other_client.sessionId);

			// mark the session as ended
			self.sessions[other_client.sessionId].player_id = 0;
			self.sessions[other_client.sessionId].player = null;
			self.sessions[other_client.sessionId].ignore = true;

			// tell other people that the old instance of them left
			client.broadcast({msg: 'left', uid: player_id});

			// destroy the old player object
			self.players[player_id].cleanup();
			delete self.players[player_id];
		}


		// create a new player object from the client
		var p = new Player(client, player_id);
		self.players[p.uid] = p;

		self.sessions[client.sessionId].player_id = p.uid;
		self.sessions[client.sessionId].player = p;

		// tell all the OTHER players about it
		client.broadcast({msg: 'joined', uid: p.uid, player: { state: p.get_state()}});

		// send a list of connected players
		var msg = {msg: 'welcome', players: {}};
		for (var i in self.players){
			var p2 = self.players[i];
			msg.players[i] = {
				state: p2.get_state(),
			};
			if (i == p.uid){
				msg.players[i].self = 1;
			}
		}
		msg.map = self.map;
		client.send(msg);
	};


};
