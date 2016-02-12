'use strict';

var config = require('../../config');
var https = require('https');
var async = require('async');

// Mongoose Models
var LadderEntry = require('../../models/ladderEntry');
var Summoner = require('../../models/summoner');

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
	httpClient('v2.5/league/challenger?type=RANKED_SOLO_5x5&', function (err, data) {
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
}

exports.importSummonerData = function(callback) {
	LadderEntry.find(function(err, entries) {
		if (err)
			return callback(err);
		async.forEachOfSeries(entries, function(entry, index, cb) {
			var path = 'v1.4/summoner/' + entry.playerOrTeamId + '?';
			httpClient(path, function(err, playerData) {
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
}

exports.httpClient = httpClient;

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