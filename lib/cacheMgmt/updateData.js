'use strict';

var utils = require('./utils');
var async = require('async');
var mongoose = require('mongoose');
var url = utils.initializeMongoDB();
mongoose.connect(url);

console.log("Begin data cache update");
async.series([
	function(callback) {
		utils.importLadderData(function(err) {
			if (err)
				callback(err);
			else {
				console.log("Ladder data update complete");
				callback(null);
			}
		});
	},
	function(callback) {
		utils.importSummonerData(function(err) {
			if (err)
				callback(err);
			else {
				console.log("Summoner data update complete");
				callback(null);
			}
		})
	},
	function(callback) {
		utils.importChampionData(function(err) {
			if (err)
				callback(err);
			else {
				console.log("Champion data update complete");
				callback(null);
			}
		})
	},
	function(callback) {
		utils.importSummonerSpellData(function(err) {
			if (err)
				callback(err);
			else {
				console.log("Spell data update complete");
				callback(null);
			}
		})
	},
	function(callback) {
		utils.importSummonerItemData(function(err) {
			if (err)
				callback(err);
			else {
				console.log("Item data update complete");
				callback(null);
			}
		})
	}
], function(err) {
	mongoose.disconnect();
	if (err)
		console.log("Error: ", err);
	else
		console.log("Data cache update complete");
});