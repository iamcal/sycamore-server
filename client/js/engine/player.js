//
// a player object. handles updating state client-side
//

function player(uid, is_self, state){

	var self = this;

	this.uid = uid;
	this.is_self = is_self;
	this.state = {};
	
	//
	// update the player's state, processing any included movement vectors
	//

	this.update_state = function(state){
		self.state = state;

		if (self.state.v){
			state.v.start = new Date().getTime();
			//self.state.x = state.v.to[0];
			//self.state.y = state.v.to[1];
		}
	};

	//
	// get the current position of this player, taking into account current movement vectors
	//

	this.get_pos = function(){

		// if they are moving, figure out where they actually are now
		if (self.state.v){
			var now = new Date().getTime();
			var frac = (now - self.state.v.start) / self.state.v.len;

			// done moving?
			if (frac >= 1){
				self.state.x = self.state.v.to[0];
				self.state.y = self.state.v.to[1];
				delete self.state.v;
			}else{
				// interpolate!
				self.state.x = Math.round(self.state.v.from[0] + frac * (self.state.v.to[0] - self.state.v.from[0]));
				self.state.y = Math.round(self.state.v.from[1] + frac * (self.state.v.to[1] - self.state.v.from[1]));
			}
		}

		return [self.state.x, self.state.y];
	};

	this.update_state(state);
}

scriptLoaded('player');