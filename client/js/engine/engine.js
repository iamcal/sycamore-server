// Here we define some globals and then load the rest of the engine
// This may be retarded

// Safety first
if (!("console" in window)){
	window.console = {
		log: function(){}
	};
}

// Inject a script tag into the DOM so it will be loaded
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

// Our scripts to load
var scripts = [
	'events',
	'graphics',
	'entity',
	'input',
	'player',
	'map',
	'net'
];

// Track when things are loaded and then start the engine after everything comes in
var scripts_loaded = [];

function scriptLoaded(name){
	console.log('Loaded: '+name);
	scripts_loaded.push(name);
	
	if (scripts_loaded.length == scripts.length){
		console.log('ENGINE LOAD COMPLETE');
		// All done!
		$(document).ready(function(){
			engine_start();
		});
	}
}

for (var i in scripts){
	loadScript('/js/engine/'+scripts[i]+'.js');
}