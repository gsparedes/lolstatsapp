var mongoose = require('mongoose');

module.exports = mongoose.model('Summoners', {
	id: {type: Number, required: true, unique: true},
	name: {type: String, required: true, unique: true},
	profileIconId: {type: Number},
	summonerLevel: {type: Number},
	revisionDate: {type: Number}
});