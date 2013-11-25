
function SycamoreMap(data){

	var self = this;

	this.data = data;
	this.ready = false;

	this.w = 0; // total pixel dimensions
	this.h = 0; // total pixel dimensions
	this.layers = [];

	this.init = function(){

		var ts_loader = new SycamoreWaitlist();

		for (var i=0; i<self.data.tilesets.length; i++){

			var ts = self.data.tilesets[i];

			var tileset = create_tileset(ts.image, ts.tilewidth, ts.tileheight);

			ts_loader.addTileset(tileset);
		}

		ts_loader.onready = self.createMap;

		ts_loader.check();
	};

	this.createMap = function(){

		for (var i=0; i<self.data.layers.length; i++){

			self.layers[i] = self.createMapLayer(self.data.layers[i]);
		}

		self.ready = true;
	};

	this.createMapLayer = function(layer_data){

		var buffer = document.createElement('canvas');
		var ctx = buffer.getContext("2d");

		self.w = self.data.tilewidth  * self.data.width;
		self.h = self.data.tileheight * self.data.height;

		buffer.width = self.w;
		buffer.height = self.h;

		for (var y=0; y<self.data.height; y++){
			for (var x=0; x<self.data.height; x++){

				var idx = (y * self.data.height) + x;
				var val = layer_data.data[idx];

				var tileset = g_tilesets["../tiles/terrain_atlas.png"];

				tileset.bltIndex(ctx, val - 1, x * self.data.tilewidth, y * self.data.tileheight);
			}
		}

		console.log('created map layer : '+layer_data.name);

		return buffer;
	};

	this.blt = function(ctx, x, y){

		for (var i=0; i<self.layers.length; i++){
			ctx.drawImage(self.layers[i], x, y);
		}
	};


	this.init();

	return this;
}