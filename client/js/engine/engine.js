// Here we define some globals and then load the rest of the engine
// This may be retarded

function loadScript(script_src){
	var script = document.createElement('script');
	script.src = script_src;
	script.type = 'text/javascript';
	document.getElementsByTagName('head')[0].appendChild(script);
}

var t; // the map tileset
var map1; // the map!
var ts1; // a preview of all the tiles in the map tileset
var s1; // spritemap for the players

var scripts = [
	'events',
	'graphics',
	'entity',
	'input',
	'player',
	'map',
	'net'
];

var scripts_loaded = [];

function scriptLoaded(name){
	console.log('Loaded: '+name);
	scripts_loaded.push(name);
	
	if (scripts_loaded.length == scripts.length){
		console.log('ENGINE LOAD COMPLETE');
		// All done!
		engine_start();
	}
}

loadScript('/js/engine/events.js');
loadScript('/js/engine/graphics.js');
loadScript('/js/engine/entity.js');
loadScript('/js/engine/input.js');
loadScript('/js/engine/player.js');
loadScript('/js/engine/map.js');
loadScript('/js/engine/net.js');