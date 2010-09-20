//
// here be the map grid. entries are the tileset index
//

var map_data = [
	[13,21,21,21,21,21,21,13,13,13,14, 9, 9, 9, 9, 9, 9, 9, 9,11,13,13,13,13,13,13,13,13],
	[14, 9,51,52,10, 9,10,11,13,13,14, 9, 7, 8, 0, 1, 9, 9, 9,11,13,13,13,13,13,13,13,13],
	[14,10,53,54, 9,10, 9,11,13,13,14, 9,23,24,17,18, 9,10, 9,11,13,13,13,13,13,13,13,13],
	[14, 9,10, 9,10, 9,10,11,13,13,14, 9,33,34,29,30, 9, 9, 9,11,13,13,13,13,13,13,13,13],
	[13, 3, 6,10, 9, 2, 3,13,13,13,14, 9,39,40,35,36, 9, 9, 9,11,13,13,13,13,13,13,13,13],
	[13,13,13, 3, 3,13,13,13,13,13,14, 9, 9, 9, 9, 9, 2, 3, 3,13,13,13,13,13,13,13,13,13],
	[13,21,21,21,21,21,21,21,21,21,21, 9, 9, 9, 9, 9,11,13,13,13,13,13,13,13,13,13,13,13],
	[14, 9,42,15,15,15,15,16, 9, 9, 9, 9,10, 9, 9, 9,11,13,13,13,13,13,13,13,13,13,13,13],
	[14, 9,43,44,45,44,45,28, 9, 9, 9, 9, 9, 9, 9, 9,41,21,21,21,21,21,21,21,21,21,21,21],
	[14, 9,75,26,26,26,26,72, 9, 9, 9, 9, 9, 9,10, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
];

//
// load the tileset, the map data, and the player sprite. prepare for player interaction
//

function init_tiles(){

	var wait = new waitlist();

	t = new tileset('pink_big.png', 16);
	//t = new tileset('pink.png', 8);
	s1 = new spritemap('bunnies.gif');

	t.onready = wait.add_wait();
	s1.onready = wait.add_wait();

	wait.onready = function(){

		map1 = new gameMap(map_data, t);
		ts1 = new tilesetPreview(t, 10, 2);

		window.setInterval(redraw_playarea, 50); // repaint the playarea canvas every 50ms
	};


	//
	// handle clicks on the gameplay canvas
	// currently these are just sent to the game server as moves
	//

	$('#playarea2').click(function(e){

		var x;
		var y;
		if (e.pageX || e.pageY){
			x = e.pageX;
			y = e.pageY;
		}else{
			x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}

		var offset = $(this).offset();

		x -= offset.left;
		y -= offset.top;

		x -= map_offset[0];
		y -= map_offset[1];


		// ignore clicks outside the map
		if (x < 0) return;
		if (y < 0) return;
		if (x >= map1.w) return;
		if (y >= map1.h) return;

		con.send({msg: 'move', x:x, y:y});
	});
}

///////////////////////////////////////////////

//
// Begin the play area, which is the canvas that the player actually sees and interacts with
//

var canvas_size = [300, 300];
var player_pos = [10,10];
var map_offset = [0,0];

function redraw_playarea(){

	var canvas = document.getElementById('playarea2');
	canvas.width = canvas_size[0];
	canvas.height = canvas_size[1];

	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas_size[0], canvas_size[1]);

	// find the position of our player
	var player_pos = [0, 0];
	for (var i in players){
		if (players[i].is_self){
			player_pos = players[i].get_pos();
		}
	}

	// position and draw the map
	map_offset = get_map_pos(map1, player_pos);
	ctx.drawImage(map1.buffer, map_offset[0], map_offset[1]);

	// draw other players
	for (var i in players){
		if (!players[i].is_self){
			var pos = players[i].get_pos();
			s1.blt(ctx, 15, 0, 15, 22, map_offset[0]+pos[0]-7, map_offset[1]+pos[1]-22);
		}
	}

	// draw our player last
	s1.blt(ctx, 0, 0, 15, 22, map_offset[0]+player_pos[0]-7, map_offset[1]+player_pos[1]-22);
}

function get_map_pos(map, camera){

	// first, position the map to put the camera position in the middle of the canvas
	var px = (canvas_size[0] >> 1) - camera[0];
	var py = (canvas_size[1] >> 1) - camera[1];

	// then make sure we're within bounds
	if (px > 0) px = 0;
	if (py > 0) py = 0;
	if (px < 0 - (map.w - canvas_size[0])) px = 0 - (map.w - canvas_size[0]);
	if (py < 0 - (map.h - canvas_size[1])) py = 0 - (map.h - canvas_size[1]);

	// check we don't need to just center it (when map is smaller than display canvas)
	if (map.w < canvas_size[0]) px = (canvas_size[0] >> 1) - Math.round(map.w / 2);
	if (map.h < canvas_size[1]) py = (canvas_size[1] >> 1) - Math.round(map.h / 2);

	return [px, py];
}

scriptLoaded('map');