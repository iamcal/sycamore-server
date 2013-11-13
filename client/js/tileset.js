
function SycamoreTileset(src, w, h){

	var self = this;

	this.img = new Image();
	this.ready = false;
	this.onready = null;
	this.w = w;
	this.h = h;

	this.img.onload = function(){
		self.ready = true;
		if (self.onready) self.onready();
	};

	this.img.src = src;

	this.blt = function(ctx, sx, sy, sw, sh, dx, dy){

		ctx.drawImage(self.img, sx, sy, sw, sh, dx, dy, sw, sh);
	};

	this.blt_tile = function(ctx, tile_x, tile_y, dx, dy){

		var sx = tile_x * self.w;
		var sy = tile_y * self.h;

		ctx.drawImage(self.img, sx, sy, self.w, self.h, dx, dy, self.w, self.h);
	};

	return self;
}


var g_tilesets = {};

function create_tileset(src, w, h){

	if (!g_tilesets[src]){
		g_tilesets[src] = new SycamoreTileset(src, w, h);
	}

	return g_tilesets[src];
}
