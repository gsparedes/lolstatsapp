var mongoose = require('mongoose');

module.exports = mongoose.model('Spells', {
	id: {type: Number, required: true, unique: true},
	name: {type: String, required: true, unique: true},
	cooldownBurn: {type: Number},
	summonerLevel: {type: Number},
	costBurn: {type: Number},
	sanitizedDescription: {type: String},
	image: {
		w: {type: Number},
		full: {type: String},
		sprite: {type: String},
		group: {type: String},
		h: {type: Number},
		y: {type: Number},
		x: {type: Number}
	}
});