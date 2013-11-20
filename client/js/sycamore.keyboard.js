
function SycamoreKeyboard(){

	var self = this;

	this.idx = 1;
	this.down = {};

	$(function(){
		$(document).keydown(function(ev){
			self.down[ev.keyCode] = self.idx++;
		}).keyup(function(ev){
			delete self.down[ev.keyCode];
		}).blur(function(){
			self.down = {};
		});
	});

	this.getDir = function(){

		var dir = null;
		var num = 0;

		if (self.down[37] > num){ dir = 'w'; num = self.down[37]; }
		if (self.down[38] > num){ dir = 'n'; num = self.down[38]; }
		if (self.down[39] > num){ dir = 'e'; num = self.down[39]; }
		if (self.down[40] > num){ dir = 's'; num = self.down[40]; }

		return dir;
	};	
};

var sycamore_keyboard = new SycamoreKeyboard();