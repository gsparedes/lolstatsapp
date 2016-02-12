'use strict';

var config = require('../config');
var async = require('async');

// Mongoose Models
var LadderEntry = require('../models/ladderEntry');
var Summoner = require('../models/summoner');

exports.getSummonerRankings = function(callback) {
	var summoners = [];
	LadderEntry.find(function(err, entries) {
		if (err)
			return callback(err);
		async.waterfall([
	      	function(cb) {
	      		async.sortBy(entries, function(entry, sortCB) {
	      			sortCB(null, entry.leaguePoints*-1);
				}, function(err, results) {
					cb(null, results);
				});
	      	},
	      	function(sortedEntries, cb) {
	      		async.forEachOfSeries(sortedEntries, function(sortedEntry, index, cb2) {
	      			Summoner.findOne({id: sortedEntry.playerOrTeamId}, function(err, summonerData) {
	      				if (err)
	      					return cb2(err);
	      				var summoner = {};
			        	summoner.name = summonerData.name;
			        	summoner.tier = 'Challenger';
			        	summoner.lp = sortedEntry.leaguePoints;
			        	summoner.rank = index + 1;
			        	summoner.img = config.lolAPI.imagePath + summonerData.profileIconId + '.png';
			        	summoner.wins = sortedEntry.wins;
			        	summoner.losses = sortedEntry.losses;
			        	var totalGames = sortedEntry.wins + sortedEntry.losses;
			        	summoner.totalGames = totalGames;
			        	summoner.winPerc = Math.round((sortedEntry.wins / totalGames ) * 100);
			        	summoner.lossPerc = Math.round((sortedEntry.losses / totalGames ) * 100);
			        	summoners.push(summoner);
			        	cb2();
	      			});
	      		}, function(err) {
	      			if (err)
	      				cb(err);
	      			else
	      				cb(null);
	      		});
	      	}
		], function(err, result) {
			if (err)
				callback(err);
			else
				callback(null, summoners);
		});
	});
};