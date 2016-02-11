'use strict';

var config = require('../config');
var fs = require('fs');
var path = require('path');
var fs = require('fs');
var jwt = require('jsonwebtoken');

// Mongoose user model
var User = require('../models/user');

exports.authenticate = function(username, password, callback) {
	var filter = {};
	filter['userName'] = {
		"$regex": username,
		"$options": "i"
	};
	User.findOne(filter, function(err, user) {
		if (user) {
			if (err) 
				callback(err);
			var hash = crypto.createHash('md5').update(password).digest('hex');
			if (user.password === hash) {
				var cert = fs.readFileSync(path.join(__dirname, '../ssl/server.key'));
				var token = jwt.sign({ firstName: user.firstName, lastName: user.lastName }, cert, { algorithm: 'RS256'});
				callback(null, {
					user: user.userName,
					firstName: user.firstName,
					lastName: user.lastName,
					accessToken: token
				});
			} else
				callback('Error: Incorrect password');
		} else
			callback('Error: User not found');
	});
};

/*exports.client = client;

function client(path, postData, method, callback) {
	var clientOptions = {
		host: peConfig.host,
		port: peConfig.port,
		path: peConfig.path + path,
		method: method,
		rejectUnauthorized: false,
		headers: {
			'Content-Type': 'application/json'
		}
	};

	var https = null;
	if (config.https) {
		https = require('https');
		clientOptions.cert = require('fs').readFileSync(peConfig.certPath);
		clientOptions.key = require('fs').readFileSync(peConfig.keyPath);
	} else
		https = require('http');

	tracer(postData.siteName, method + " - " + clientOptions.host + " - " + clientOptions.path);
	var req = https.request(clientOptions, function(res) {
		tracer(postData.siteName, "Response status code - " + res.statusCode);
		callback();
	});

	req.on('error', function(e) {
	  	callback(e);
	});

	req.write(postData);
	req.end();
};*/