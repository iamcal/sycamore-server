
exports.gameEngine = function(){

	var self = this;

	this.players = {};

	this.addPlayer = function(client){

		console.log('adding a player');

		var p = new player(client);
		self.players[p.uid] = p;

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

	this.removePlayer = function(client){
		var uid = client.sessionId;
		delete self.players[uid];

		client.broadcast({msg: 'left', uid: uid});
	};

	this.playerMsg = function(client, msg){

		var uid = client.sessionId;
		var p = self.players[uid];

		if (msg.msg == 'move'){
			p.move(msg.x, msg.y);
			return;
		}

		client.send({msg: 'unhandled', src: msg});
	};
}

function random(lo, hi){
	return lo + Math.floor(Math.random()*(1+hi-lo));
}

function player(client){

	var self = this;

	this.client = client;
	this.uid = client.sessionId;
	this.x = random(20,400);
	this.y = random(20,100);
	this.moveSpeed = 50; // pixels per second

	this.get_state = function(){
		self.update_move();
		return {
			x: self.x,
			y: self.y,
			v: self.vector,
		};
	};

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
		// boradcast this too!
	};

	this.stop_move = function(){

		self.update_move();
		delete self.vector;
	};

	this.update_move = function(){

		if (!self.vector) return;

		var now = new Date().getTime();
		var frac = (now - self.vector.start) / self.vector.len;

		if (frac >= 1){
			self.x = self.vector.to[0];
			self.y = self.vector.to[1];
			delete self.vector;
		}else{
			self.x = self.vector.from[0] + frac * (self.vector.to[0] - self.vector.from[0]);
			self.y = self.vector.from[1] + frac * (self.vector.to[1] - self.vector.from[1]);
		}
	};
}

