var mongoose = require('mongoose');

module.exports = mongoose.model('Champions', {
	id: {type: Number, required: true, unique: true},
	name: {type: String, required: true, unique: true},
	title: {type: String},
	lore: {type: String},
	key: {type: String},
	tags: [
		String
	],
	stats: {
		attackrange: {type: Number},
		mpperlevel: {type: Number},
		mp: {type: Number},
		attackdamage: {type: Number},
		hp: {type: Number},
		hpperlevel: {type: Number},
		attackdamageperlevel: {type: Number},
		armor: {type: Number},
		mpregenperlevel: {type: Number},
		hpregen: {type: Number},
		critperlevel: {type: Number},
		spellblockperlevel: {type: Number},
		mpregen: {type: Number},
		attackspeedperlevel: {type: Number},
		spellblock: {type: Number},
		movespeed: {type: Number},
		attackspeedoffset: {type: Number},
		crit: {type: Number},
		hpregenperlevel: {type: Number},
		armorperlevel: {type: Number},
	},
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