
exports.gameEngine = function(){

	var self = this;

	this.players = {};

	//
	// add a newly-connected player to the world
	//
	
	this.addPlayer = function(client){

		console.log('adding a player');

		// create a new player object from the client
		var p = new player(client);
		self.players[p.uid] = p;

		// tell all the other players about it
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

		// tell all the other players about it
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

function random(lo, hi){
	return lo + Math.floor(Math.random()*(1+hi-lo));
}


//
// a player object
//

function player(client){

	var self = this;

	this.client = client; // reference to their socket.io client
	this.uid = client.sessionId;
	this.x = random(20,400); // put them in a random position
	this.y = random(20,100);
	this.moveSpeed = 50; // pixels per second


	//
	// get compact state information about a player
	// includes current position and movement info
	//
	
	this.get_state = function(){
		self.update_move();
		return {
			x: self.x,
			y: self.y,
			v: self.vector,
		};
	};
	
	
	//
	// start a move, calculating path to target and move duration
	// notifies other players about the move so they can render the steps
	//

	this.move = function(x, y){

		if (x == self.x && y == self.y) return;

		// stop any pending movement vector first
		self.stop_move();

		// how far are they going and how long will it take
		var dx = Math.abs(self.x - x);
		var dy = Math.abs(self.y - y);
		var dist = Math.sqrt(dx * dx + dy * dy);
		var time = (dist / self.moveSpeed) * 1000;

		// create the new vector
		self.vector = {
			from: [self.x, self.y],
			to: [x, y],
			start: new Date().getTime(),
			len: time,
		};

		var state = self.get_state();
		client.send({msg: 'move', uid: self.uid, state: state});
		client.broadcast({msg: 'move', uid: self.uid, state: state});
		// broadcast this too!
	};
	
	
	//
	// stop an in-progress move
	//

	this.stop_move = function(){

		self.update_move();
		delete self.vector;
	};
	
	
	//
	// update the player's position based on any in-progress moves
	//

	this.update_move = function(){

		if (!self.vector) return;

		var now = new Date().getTime();
		var frac = (now - self.vector.start) / self.vector.len;

		// done?
		if (frac >= 1){
			self.x = self.vector.to[0];
			self.y = self.vector.to[1];
			delete self.vector;
		}else{
			// interpolate
			self.x = self.vector.from[0] + frac * (self.vector.to[0] - self.vector.from[0]);
			self.y = self.vector.from[1] + frac * (self.vector.to[1] - self.vector.from[1]);
		}
	};
}

