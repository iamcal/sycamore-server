
function SycamoreWaitlist(){

	var self = this;

	this.waiting = {};
	this.uid = 1;
	this.fired = false;
	this.onready = null;

	this.addHandler = function(){
		var u = self.uid++;
		self.waiting[u] = 0;
		return function(){
			self.waiting[u] = 1;
			self.check();
		};
	}

	this.addTileset = function(ts){

		if (ts.ready) return;
		ts.onready = self.addHandler();
	}

	this.check = function(){

		if (self.fired) return;

		for (var i in self.waiting){
			if (!self.waiting[i]) return;
		}

		self.fired = true;
		if (self.onready) self.onready();
	}
}
