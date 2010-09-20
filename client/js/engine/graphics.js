//
// load an spritesheet image and prep for drawing
//

function spritemap(src){

	var self = this;

	this.img = new Image();
	this.ready = false;
	this.onready = null;

	this.img.onload = function(){
		self.ready = true;
		if (self.onready) self.onready();
	};

	this.img.src = src;

	this.blt = function(ctx, sx, sy, sw, sh, dx, dy){

		ctx.drawImage(self.img, sx, sy, sw, sh, dx, dy, sw, sh);
	};
}


//
// load a tileset image and prep for drawing
//

function tileset(src, sz){

	var self = this;

	this.img = new Image();
	this.sz = sz;
	this.ready = false;
	this.onready = null;
	this.w = 1;
	this.h = 1;

	this.img.onload = function(){
		self.w = Math.floor(self.img.width / self.sz);
		self.h = Math.floor(self.img.height / self.sz);
		self.ready = true;
		if (self.onready) self.onready();
	};

	this.img.src = src;

	this.blt = function(ctx, tile_id, x, y){

		var sx = tile_id % self.w;
		var sy = Math.floor(tile_id / self.w);

		ctx.drawImage(self.img, sx * self.sz, sy * self.sz, self.sz, self.sz, x, y, self.sz, self.sz);
	};	
}


//
// a game map takes a grid and a tileset, creates a buffer canvas and draws the entire thing onto it
//

function gameMap(grid, tileset){

	var self = this;

	this.grid = grid;
	this.tileset = tileset;


	//
	// find the size of the map in tiles
	//

	this.tw = 0;
	this.th = grid.length;

	for (var y=0; y<this.th; y++){
		if (grid[y].length > this.tw) this.tw = grid[y].length;
	}


	//
	// now we have the real size, so create the buffer
	//

	this.w = this.tw * tileset.sz;
	this.h = this.th * tileset.sz;
	this.buffer = document.createElement('canvas');
	this.buffer.width = this.w;
	this.buffer.height = this.h;


	//
	// paint the map onto the buffer
	//

	var ctx = this.buffer.getContext("2d");

	for (var y=0; y<grid.length; y++){
		for (var x=0; x<grid[y].length; x++){

			tileset.blt(ctx, grid[y][x], x * tileset.sz, y * tileset.sz);
		}
	}
}


//
// takes a tileset and draws the whole thing on a buffer canvas
// useful for finding the one you want
//

function tilesetPreview(tileset, cols, spacing){

	var num = tileset.w * tileset.h;
	var rows = Math.ceil(num / cols);

	this.buffer = document.createElement('canvas');
	this.buffer.width = cols * tileset.sz;
	this.buffer.height = rows * tileset.sz;

	var ctx = this.buffer.getContext("2d");

	for (var i=0; i<num; i++){
		var col = i % cols;
		var row = Math.floor(i / cols);

		tileset.blt(ctx, i, col * (tileset.sz + spacing), row * (tileset.sz + spacing));
	}
}

scriptLoaded('graphics');