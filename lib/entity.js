var util = require('./util').util;

//
// this is our basic entity, from which all in-game objects are formed
//

var Entity = function(){

	this.type;
	this.uid = null;
	this.x = this.y = 0;
	this.moveSpeed = 0; // pixels per second

};


//
// get compact state information
// includes current position and movement info
//

Entity.prototype.get_state = function(){
	this.update_move();
	return {
		x: this.x,
		y: this.y,
		v: this.vector,
		type: this.type,
	};
};
	

//
// start a move, calculating path to target and move duration
//

Entity.prototype.move = function(x, y){

	if (x == this.x && y == this.y) return;
	
	// stop any pending movement vector first
	this.stop_move();

	// how far are they going and how long will it take
	var dx = Math.abs(this.x - x);
	var dy = Math.abs(this.y - y);
	var dist = Math.sqrt(dx * dx + dy * dy);
	var time = (dist / this.moveSpeed) * 1000;

	// create the new vector
	this.vector = {
		from: [this.x, this.y],
		to: [x, y],
		start: new Date().getTime(),
		len: time,
	};
};
	
	
//
// stop an in-progress move
//

Entity.prototype.stop_move = function(){

	this.update_move();
	delete this.vector;
};
	
	
//
// update the position based on any in-progress moves
//

Entity.prototype.update_move = function(){

	if (!this.vector) return;

	var now = new Date().getTime();
	var frac = (now - this.vector.start) / this.vector.len;

	// done?
	if (frac >= 1){
		this.x = this.vector.to[0];
		this.y = this.vector.to[1];
		delete this.vector;
	}else{
		// interpolate
		this.x = this.vector.from[0] + frac * (this.vector.to[0] - this.vector.from[0]);
		this.y = this.vector.from[1] + frac * (this.vector.to[1] - this.vector.from[1]);
	}
};

exports.Entity = Entity;