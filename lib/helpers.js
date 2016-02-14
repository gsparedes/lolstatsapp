'use strict';

var config = require('../config');
var async = require('async');
var https = require('https');

// Mongoose Models
var LadderEntry = require('../models/ladderEntry');
var Summoner = require('../models/summoner');
var Champion = require('../models/champion');

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
	      				summoner.id = summonerData.id;
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

exports.getSummonerByName = function(summonerName, callback) {
	var path = 'v1.4/summoner/by-name/' + summonerName + '?';
	httpClient(path, function(err, data) {
		if (err)
			return callback(err);
		console.log(data[summonerName])
		callback(null, data[summonerName]);
	});
};

exports.getSummonerData = function(summonerId, callback) {	
	var path = 'v1.4/summoner/' + summonerId + '?';
	httpClient(path, function(err, data) {
		if (err)
			return callback(err);
		var summonerData = {};
		summonerData = data[summonerId];
		summonerData.img = config.lolAPI.imagePath + summonerData.profileIconId + '.png';
		console.log(summonerData)
		callback(null, summonerData);
	});
};

exports.getSummonerChampionData = function(summonerId, season, callback) {
	var summonerChampions = [];
	async.waterfall([
		function(cb) {
			var path = 'v1.3/stats/by-summoner/' + summonerId + '/ranked?season=' + season + '&';
			httpClient(path, function(err, data) {
				if (err)
					return cb(err);
				cb(null, data.champions);
			});
		},
		function(champions, cb) {
      		async.sortBy(champions, function(champion, sortCB) {
      			sortCB(null, champion.stats.totalSessionsPlayed*-1);
			}, function(err, results) {
				cb(null, results);
			});
      	},
		function(champions, cb) {
			async.forEachOfSeries(champions, function(champion, index, cb2) {
				Champion.findOne({id: champion.id}, function(err, champData) {
					if (err)
						return cb2(err);
					else if (!champData)
						return cb2();
					var summonerChampion = champion;
					summonerChampion.name = champData.name;
					summonerChampion.img = config.lolAPI.champImgPath + champData.name.replace(/[^A-Z0-9]/ig, "") + '.png';
					summonerChampion.rank = index;
					summonerChampion.kills = champion.stats.totalChampionKills;
					summonerChampion.deaths = champion.stats.maxNumDeaths;
					summonerChampion.assists = champion.stats.totalAssists;
					summonerChampion.cs = champion.stats.totalMinionKills;
					summonerChampion.gold = champion.stats.totalGoldEarned;
					summonerChampion.totalSessionsWon = champion.stats.totalSessionsWon;
					summonerChampion.totalSessionsLost = champion.stats.totalSessionsLost;
					summonerChampion.totalSessionsPlayed = champion.stats.totalSessionsPlayed;
					summonerChampion.winPerc = Math.round((champion.stats.totalSessionsWon / champion.stats.totalSessionsPlayed ) * 100);
					summonerChampion.lossPerc = Math.round((champion.stats.totalSessionsLost / champion.stats.totalSessionsPlayed ) * 100);
					summonerChampions.push(summonerChampion);
					cb2();
				});
			}, function(err) {
				if (err)
					cb(err);
				else
					cb(null);
			});
		}
	], function(err, results) {
		if (err)
			callback(err);
		else
			callback(null, summonerChampions);
	});
};

function httpClient(path, callback) {
	var clientOptions = {
		host: config.lolAPI.endpoint,
		path: config.lolAPI.path + path + 'api_key=' + config.lolAPI.key,
		method: 'GET',
		rejectUnauthorized: false,
		headers: {
			'Content-Type': 'application/json'
		}
	};

	console.log("GET - " + clientOptions.host + " - " + clientOptions.path);
	var req = https.request(clientOptions, function(res) {
		console.log("Response status code - " + res.statusCode);
		if (res.statusCode === 429)
			console.log(res.headers)

		var body = '';
		res.on('data', function(d) {
	    	body += d;
	  	});

	  	res.on('end', function() {
            var json = JSON.parse(body);
            return callback(null, json);
        });
	});

	req.on('error', function(e) {
	  	return callback(e);
	});
	req.end();
};