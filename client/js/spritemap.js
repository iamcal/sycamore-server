
function SycamoreSpritemap(animations, speed){

	var self = this;

	this.animations = animations;
	this.speed = speed || 1;

	this.blt = function(ctx, tileset_name, animation_name, frame, x, y){

		var ts = g_tilesets[tileset_name];
		if (!ts){
			create_tileset(tileset_name, tileset_name, 64, 64);
			return;
		}
		if (!ts.ready) return;

		var ani = this.animations[animation_name];
		if (!ani) return;

		var f = 0+frame;

		f = Math.floor(f/self.speed);

		f = (f % (ani.length >>> 1)) << 1;

		var tile_x = ani[f];
		var tile_y = ani[f+1];

		ts.blt_tile(ctx, tile_x, tile_y, x, y);
	};

	return self;
}

var g_spritemaps = {};

function create_spritemap(name, animations, speed){

	g_spritemaps[name] = new SycamoreSpritemap(animations, speed);
}