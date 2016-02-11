(function() {
    'use strict';

    var express = require('express');
    var path = require('path');
    var bodyParser = require('body-parser');
    var cookieParser = require('cookie-parser');
    var config = require('./config');
    var fs = require('fs');
    var http = require('http');
    var https = require('https');
    var mongoose = require('mongoose');
    var favicon = require('serve-favicon');

    var routes = require('./routes/index');
    var url = initializeMongoDB();
    mongoose.connect(url);

    var options = {
        key: fs.readFileSync(path.join(__dirname, '/ssl/server.key')),
        cert: fs.readFileSync(path.join(__dirname, '/ssl/server.crt')),
        ca: fs.readFileSync(path.join(__dirname, '/ssl/ca.crt')),
        requestCert: true,
        rejectUnauthorized: false
    };

    var app = express();
    app.set('views', path.join(__dirname, '/public/views'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, '/public')));
    app.use(favicon(path.join(__dirname, '/public/images/favicon.ico')));

    app.all('*', function(req, res, next) {
        res.header('Access-Control-Allow-Methods', 'GET,HEAD,POST,PUT,DELETE');
        res.header("Access-Control-Allow-Headers", "X-Requested-With,X-Powered-By,Content-Type");
        res.header("X-Frame-Options", "SAMEORIGIN");
        res.header("Cache-Control", "no-cache, no-store, must-revalidate, pre-check=0, post-check=0, max-age=0, s-maxage=0");
        res.header("Pragma", "no-cache");
        res.header("Expires", "0");
        var methods = "|GET|HEAD|POST|PUT|DELETE";
        if (methods.search(req.method) > 0) {
            next();
        } else {
            res.status(444).end();
        }        
    });

    app.use('/', routes);

    var server = http.createServer(app);
    if (config.https)
        server = https.createServer(options, app);
    server.listen(config.port, function() {
        if (config.https)
            console.log('HTTPS Express server listening on port ' + config.httpsPort);
        else
            console.log('HTTP Express server listening on port ' + config.port);
    });

    module.exports = app;

    function initializeMongoDB() {
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
}());
