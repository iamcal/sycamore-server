// Where utility functions will go
exports.util = {
	random: function(lo, hi){
		return lo + Math.floor(Math.random()*(1+hi-lo));
	}
};