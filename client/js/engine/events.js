//
// waitlist is a simple class that helps you wait for multiple events to complete.
// just hook all of the events you want to wait for up to handlers and onready will
// be fired once all of the sub-events fire. e.g.
//
// var w = new waitlist();
// map1.onready = w.add_wait();
// map2.onready = w.add_wait();
// sprites2.onready = w.add_wait();
// w.onready = function(){ ...only fires once all objects are ready... }
//

function waitlist(){

	var self = this;

	this.waiting = {};
	this.uid = 1;
	this.fired = false;
	this.onready = null;

	this.add_wait = function(){
		var u = self.uid++;
		self.waiting[u] = 0;
		return function(){
			self.waiting[u] = 1;
			self.check();
		};
	};

	this.check = function(){

		if (self.fired) return;

		for (var i in self.waiting){
			if (!self.waiting[i]) return;
		}

		self.fired = true;
		if (self.onready) self.onready();
	};
}

scriptLoaded('events');
