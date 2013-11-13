

function SycamoreMob(w, h){

	var self = this;

	this.spritemap = null;
	this.layers = [];

	this.w = w;
	this.h = h;

	this.x = 100;
	this.y = 100;

	this.blt = function(ctx, animation, frame, x, y){

animation = 'die';

		var idx = self.spritemap.animate_to(animation, frame);

		if (idx[0] < 0) return;

		for (var i=0; i<self.layers.length; i++){

			self.spritemap.blt(ctx, self.layers[i], idx[0], idx[1], x, y);
		}
	};

	this.draw = function(ctx, frame){

		if (self.walking){
			self.blt(ctx, self.animation + '-' + self.direction, frame, self.x, self.y);
		}else{
			self.blt(ctx, self.animation + '-' + self.direction, 0, self.x, self.y);
		}
	};


	return self;
}