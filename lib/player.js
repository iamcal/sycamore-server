var util = require('./util').util,
	Entity = require('./entity').Entity;

//
// a player object
//

var Player = function(client){
	
	Entity.call(this); // Call our parent constructor

	this.client = client; // reference to their socket.io client
	this.uid = client.sessionId;
	this.x = util.random(20,400); // put them in a random position
	this.y = util.random(20,100);
	this.moveSpeed = 50; // pixels per second
};

require('sys').inherits(Player, Entity); // Inherit from Entity - MUST come before we override methods below
	
//
// do our move and notify other players about the move so they can render the steps
//

Player.prototype.move = function(x, y){

	Entity.prototype.move.call(this, x, y); // Call our parent move function

	var state = this.get_state();
	this.client.send({msg: 'move', uid: this.uid, state: state}); // tell ourselves about it
	this.client.broadcast({msg: 'move', uid: this.uid, state: state}); // tell everyone else about it
};

exports.Player = Player;