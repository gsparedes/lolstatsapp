'use strict';

var config = require('../../config');
var https = require('https');
var async = require('async');

// Mongoose Models
var LadderEntry = require('../../models/ladderEntry');
var Summoner = require('../../models/summoner');
var Champion = require('../../models/champion');
var Spell = require('../../models/spell');
var Item = require('../../models/item');

exports.initializeMongoDB = function() {
    var mongoConfig = config.mongoConnectionInfo || {};
    var farmIPs = mongoConfig.ips;
    var dataset = mongoConfig.database;
    var hostArray = farmIPs.split(",");
    if (hostArray.length > 1) {
        var url = 'mongodb://' + farmIPs + '/' + dataset + '?slaveOk=true';
    } else {
        var url = 'mongodb://' + farmIPs + '/' + dataset;
    }
    return url;
}

exports.importLadderData = function(callback) {
	var path = config.lolAPI.path + 'v2.5/league/challenger?type=RANKED_SOLO_5x5&';
	httpClient(config.lolAPI.endpoint, path, function (err, data) {
		if (err)
        	return callback(err);
        else {
        	async.forEachOfSeries(data.entries, function (entry, index, cb) {
        		var newLadderEntry = new LadderEntry(entry);
        		newLadderEntry.save(function (err) {
					if (err)
						cb(err);
					else
						cb();
				});
        	}, function (err) {
        		if (err)
        			callback(err);
        		else
        			callback();
        	});
        }
    });
};

exports.importSummonerData = function(callback) {
	LadderEntry.find(function(err, entries) {
		if (err)
			return callback(err);
		async.forEachOfSeries(entries, function(entry, index, cb) {
			var path = config.lolAPI.path +'v1.4/summoner/' + entry.playerOrTeamId + '?';
			httpClient(config.lolAPI.endpoint, path, function(err, playerData) {
				var newSummoner = new Summoner(playerData[entry.playerOrTeamId]);
				newSummoner.save(function (err) {
					if (err)
						cb(err);
					else {
						setTimeout(cb, 2000);
					}
				});
			});
		}, function(err) {
			if (err)
				callback(err);
			else
				callback();
		});
	})
};

exports.importChampionData = function(callback) {
	httpClient(config.lolAPI.endpoint, config.lolAPI.path + 'v1.2/champion?', function(err, data) {
		async.forEachOfSeries(data.champions, function(champion, index, cb) {
			var path = '/api/lol/static-data/na/v1.2/champion/' + champion.id + '?champData=all&';
			httpClient(config.lolAPI.globalEndpoint, path, function(err, champData) {
				var newChamp = new Champion(champData);
				newChamp.save(function (err) {
					if (err)
						cb(err);
					else {
						setTimeout(cb, 2000);
					}
				});
			});
		}, function(err) {
			if (err)
				callback(err);
			else
				callback();
		});
	});
};

exports.importSummonerSpellData = function(callback) {
	var path = '/api/lol/static-data/na/v1.2/summoner-spell?spellData=all&';
	httpClient(config.lolAPI.globalEndpoint, path, function(err, spellData) {
		if (err)
			return callback(err);
		else {
			async.forEachOfSeries(spellData.data, function(spell, key, cb) {
				var newSpell = new Spell(spell);
        		newSpell.save(function (err) {
					if (err)
						cb(err);
					else
						cb();
				});
			}, function(err) {
				if (err)
					callback(err);
				else
					callback();
			});
		}		
	});
};

exports.importSummonerItemData = function(callback) {
	var path = '/api/lol/static-data/na/v1.2/item?itemListData=all&';
	httpClient(config.lolAPI.globalEndpoint, path, function(err, itemData) {
		if (err)
			return callback(err);
		else {
			async.forEachOfSeries(itemData.data, function(item, key, cb) {
				var newItem = new Item(item);
        		newItem.save(function (err) {
					if (err)
						cb(err);
					else
						cb();
				});
			}, function(err) {
				if (err)
					callback(err);
				else
					callback();
			});
		}		
	});
};

exports.httpClient = httpClient;

function httpClient(host, path, callback) {
	var clientOptions = {
		host: host,
		path: path + 'api_key=d0feb26f-2e3b-43c7-884f-0efda474fb1c',
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