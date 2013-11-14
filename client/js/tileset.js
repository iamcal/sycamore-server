
function SycamoreTileset(src, tile_w, tile_h){

	var self = this;

	this.img = new Image();
	this.ready = false;
	this.onready = null;

	this.tile_w = tile_w;
	this.tile_h = tile_h;

	this.tiles_w = 1;
	this.tiles_h = 1;

	this.img.onload = function(){

		self.tiles_w = Math.floor(self.img.width / self.tile_w);
		self.tiles_h = Math.floor(self.img.height / self.tile_h);

		self.ready = true;
		if (self.onready) self.onready();
	};

	this.img.src = src;

	this.blt = function(ctx, sx, sy, sw, sh, dx, dy){

		ctx.drawImage(self.img, sx, sy, sw, sh, dx, dy, sw, sh);
	};

	this.blt_tile = function(ctx, tile_x, tile_y, dx, dy){

		var sx = tile_x * self.tile_w;
		var sy = tile_y * self.tile_h;

		ctx.drawImage(self.img, sx, sy, self.tile_w, self.tile_h, dx, dy, self.tile_w, self.tile_h);
	};

	this.bltIndex = function(ctx, tile_index, dx, dy){

		var tile_y = Math.floor(tile_index / self.tiles_w);
		var tile_x = tile_index % self.tiles_w;

		return self.blt_tile(ctx, tile_x, tile_y, dx, dy);
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
