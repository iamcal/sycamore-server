var util = require('./util').util,
	Entity = require('./entity').Entity;

//
// an item object
//

var Item = function(){
	
	Entity.call(this); // Call our parent constructor

	this.type = 'item';
};

require('sys').inherits(Item, Entity); // Inherit from Entity - MUST come before we override methods below

exports.Item = Item;