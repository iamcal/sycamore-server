
exports.gameEngine = function(){

	var self = this;

	this.players = {};

	this.addPlayer = function(client){
		var uid = client.sessionId;
		self.players[uid] = {
			client: client,
			x: 0,
			y: 0,
		};

		client.broadcast({msg: 'joined', uid: uid});
		client.send({msg: 'welcome'});
	};

	this.removePlayer = function(client){
		var uid = client.sessionId;
		delete self.players[uid];

		client.broadcast({msg: 'left', uid: uid});
	};

	this.playerMsg = function(client, msg){

		client.broadcast({msg: 'fwd', src: msg});
		client.send({msg: 'fwd', src: msg});
	};
}
