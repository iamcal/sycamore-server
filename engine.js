
exports.gameEngine = function(){

	var self = this;

	this.players = {};

	this.addPlayer = function(client){

		console.log('adding a player');

		var p = new player(client);
		self.players[p.uid] = p;

		client.broadcast({msg: 'joined', uid: p.uid, player: p.get_state()});

		// send a list of connected players
		var msg = {msg: 'welcome', players: {}};
		for (var i in self.players){
			var p2 = self.players[i];
			msg.players[i] = p2.get_state();
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



function player(client){

	var self = this;

	this.client = client;
	this.uid = client.sessionId;
	this.x = 200;
	this.y = 200;

	this.get_state = function(){
		return {
			x: self.x,
			y: self.y,
		};
	};

	this.move = function(x, y){

		this.x = x;
		this.y = y;
		client.broadcast({msg: 'moved', uid: this.uid, x:x, y:y});
		client.send({msg: 'moved', uid: this.uid, x:x, y:y});
	};
}

