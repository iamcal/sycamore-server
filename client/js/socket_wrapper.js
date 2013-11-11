
function SocketWrapper(config){

	var self = this;

	this.config = config;
	this.connected = false;
	this.connecting = false;

	this.eventHandlers = {};
	this.socket = null;


	//
	// control
	//

	this.connect = function(){

		if (self.connected || self.connecting) return;

		self.socket = new WebSocket('ws://'+self.config.host+':'+self.config.port+self.config.path);

		self.socket.onopen = function(){
			self.connected = true;
			self.connecting = false;
			self.emit('connect');
		};

		self.socket.onclose = function(){
			self.connected = false;
			self.connecting = false;
			self.emit('close');
		};

		self.socket.onmessage = function(msg){
			if (!msg.data) return;
			//console.log('msg in', msg.data);
			self.emit('message', JSON.parse(msg.data));
		};

		self.connecting = true;
	};

	this.disconnect = function(){

		if (self.connected || self.connecting){

			self.socket.close();
		}
	};

	this.send = function(msg){

		if (self.connected || self.connecting){
			this.socket.send(JSON.stringify(msg));
		}
	};


	//
	// event handlers
	//

	this.on = function(ev, f){
		if (!self.eventHandlers[ev]){
			self.eventHandlers[ev] = [];
		}
		self.eventHandlers[ev].push(f);
	};

	this.emit = function(){
		var args = Array.prototype.slice.call(arguments);
		var ev = args.shift();
		if (self.eventHandlers[ev]){
			for (var i=0; i<self.eventHandlers[ev].length; i++){
				var f = self.eventHandlers[ev][i];
				f.apply(self, args);
			}
		}
	}

	return self;
}
