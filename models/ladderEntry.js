var mongoose = require('mongoose');

module.exports = mongoose.model('LadderEntries', {
	leaguePoints: {type: Number, required: true},
	isFreshBlood: {type: Boolean},
	isHotStreak: {type: Boolean},
	division: {type: String},
	isInactive: {type: Boolean},
	isVeteran: {type: Boolean},
	losses: {type: Number},
	playerOrTeamName: {type: String, required: true, unique: true},
	playerOrTeamId: {type: Number, required: true, unique: true},
	wins: {type: Number}
});