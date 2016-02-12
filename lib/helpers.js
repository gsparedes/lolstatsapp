'use strict';

var config = require('../config');
var https = require('https');

exports.httpClient = client;

function client(path, callback) {
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
		
		var body = '';
		res.on('data', function(d) {
	    	body += d;
	    	console.log(body)
	  	});

	  	res.on('end', function() {
            var json = JSON.parse(body);
            console.log(json)
            return callback(null, json);
        });
	});

	req.on('error', function(e) {
	  	return callback(e);
	});
	req.end();
};