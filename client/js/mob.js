

function SycamoreMob(w, h){

	var self = this;

	this.spritemap = null;
	this.layers = [];

	this.w = w;
	this.h = h;

	this.x = 100;
	this.y = 100;

	this.blt = function(ctx, animation, frame, x, y){

		for (var i=0; i<self.layers.length; i++){

			self.spritemap.blt(ctx, self.layers[i], animation, frame, x, y);
		}
	};

	this.draw = function(ctx, frame){

		if (self.walking){
			self.blt(ctx, self.direction, frame, self.x, self.y);
		}else{
			self.blt(ctx, self.direction, 0, self.x, self.y);
		}
	};


	return self;
}