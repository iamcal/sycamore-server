
function SycamoreSpritemap(animations, speed){

	var self = this;

	this.animations = animations;
	this.speed = speed || 1;

	this.blt = function(ctx, tileset_name, tile_x, tile_y, x, y){

		var ts = g_tilesets[tileset_name];
		if (!ts){
			create_tileset(tileset_name, 64, 64);
			return;
		}
		if (!ts.ready) return;

		ts.blt_tile(ctx, tile_x, tile_y, x, y);
	};


	// determine which tile index to use to this frame of
	// this animation.

	this.animate_to = function(animation_name, frame){

		var ani = this.animations[animation_name];
		if (!ani) return [-1, -1];

		var f = 0+frame;

		f = Math.floor(f/self.speed);

		f = (f % (ani.length >>> 1)) << 1;

		return [ani[f], ani[f+1]];
	};

	return self;
}

var g_spritemaps = {};

function create_spritemap(name, animations, speed){

	g_spritemaps[name] = new SycamoreSpritemap(animations, speed);
}