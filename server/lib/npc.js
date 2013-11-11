var util = require('./util').util,
	Entity = require('./entity').Entity;

//
// an NPC object
//

var NPC = function(){
	
	Entity.call(this); // Call our parent constructor

	this.type = 'npc';
	//this.uid = ;
	this.x = util.random(20,400); // put them in a random position
	this.y = util.random(20,100);
	this.moveSpeed = 50; // pixels per second
};

require('sys').inherits(NPC, Entity); // Inherit from Entity - MUST come before we override methods below

exports.NPC = NPC;
