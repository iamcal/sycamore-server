
function SycamoreCollisionManager(){

	var self = this;

	this.master = [];
	this.map_layers = [];

	this.tiles_w = 0;
	this.tiles_h = 0;

	this.rebuildMap = function(){

		// rebuild the master collision map from the various data that comprises it

		self.master = [];

		if (self.map_layers.length){

			self.tiles_w = self.map_layers[0].width;
			self.tiles_h = self.map_layers[0].height;

			// allocate the map
			self.master[(self.tiles_w * self.tiles_h)-1] = false;

			for (var y=0; y<self.tiles_h; y++){
			for (var x=0; x<self.tiles_w; x++){

				var idx = x+(y * self.tiles_w);
				var flag = false;

				for (var i=0; i<self.map_layers.length; i++){
					if (self.map_layers[i].data[idx]) flag = true;
				}

				self.master[idx] = flag;
			}
			}
		}

		console.log('completed master map');
	};

	this.testTile = function(x, y){

		var idx = x + (y * self.tiles_w);
		return self.master[idx];
	};

	this.addMapLayer = function(data){

		this.map_layers.push(data);
		this.rebuildMap();
	}
}

var collision_manager = new SycamoreCollisionManager();