// Everything we need to get this done
var util = require('./util').util,
	Player = require('./player').Player,
	NPC = require('./npc').NPC,
	Item = require('./item').Item;

// The game engine
exports.gameEngine = function(){

	var self = this;

	this.players = {};

	//
	// add a newly-connected player to the world
	//
	
	this.addPlayer = function(client){

		console.log('adding a player');

		// create a new player object from the client
		var p = new Player(client);
		self.players[p.uid] = p;

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
		client.send(msg);
	};

	//
	// remove a player from the world (disconnect, etc)
	//
	
	this.removePlayer = function(client){
		var uid = client.sessionId;
		delete self.players[uid];

		// tell all the OTHER players about it
		client.broadcast({msg: 'left', uid: uid});
	};

	//
	// handle player commands from the client
	//
	
	this.playerMsg = function(client, msg){

		var uid = client.sessionId;
		var p = self.players[uid];

		if (p){
			// move to x,y
			if (msg.msg == 'move'){
				p.move(msg.x, msg.y);
				return;
			}
		}

		client.send({msg: 'unhandled', src: msg});
	};
};