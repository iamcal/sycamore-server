
function SycamoreSpritemap(animations){

	var self = this;

	this.animations = animations;

	this.blt = function(ctx, tileset_name, animation_name, frame, x, y){

		var ts = g_tilesets[tileset_name];
		if (!ts) return;
		if (!ts.ready) return;

		var ani = this.animations[animation_name];
		if (!ani) return;

		frame = (frame % (ani.length >> 1)) << 1;
//console.log(frame);
		var tile_x = ani[frame];
		var tile_y = ani[frame+1];

		ts.blt_tile(ctx, tile_x, tile_y, x, y);
//console.log(tile_x, tile_y, x, y);
	};

	return self;
}

var g_spritemaps = {};

function create_spritemap(name, animations){

	g_spritemaps[name] = new SycamoreSpritemap(animations);
}