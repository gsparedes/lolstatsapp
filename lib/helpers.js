'use strict';

var config = require('../config');
var async = require('async');
var https = require('https');

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

exports.getSummonerByName = function(summonerName, callback) {
	var summonerDetailData = {};
	async.waterfall([
		function(cb) {
			var path = 'v1.4/summoner/by-name/' + summonerName + '?';
			httpClient(path, function(err, data) {
				if (err)
					return cb(err);
				console.log(data)
				summonerDetailData = data[summonerName];
				cb(null, summonerDetailData.id);
			});
		},
		function(summonerId, cb) {
			console.log(summonerId)
			cb(null);
		}
	], function(err) {
		if (err)
			callback(err);
		else
			callback(null, summonerDetailData);
	});
};

function httpClient(path, callback) {
	var clientOptions = {
		host: config.lolAPI.endpoint,
		path: config.lolAPI.path + path + 'api_key=d0feb26f-2e3b-43c7-884f-0efda474fb1c',
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