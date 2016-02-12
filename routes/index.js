(function() {

  'use strict';
  var express = require('express');
  var router = express.Router();
  var config = require('../config');
  var helpers = require('../lib/helpers');
  var path = require('path');
  var async = require('async');

  module.exports = router;

  router.get('/checkit', function(req, res) {
    res.sendStatus(200);
    res.end();
  });

  router.get('/api/playerLadderRankings', function(req, res) {
    console.log("REQUEST RECEIVED")
    helpers.httpClient('league/challenger?type=RANKED_SOLO_5x5&', function(err, players) {
      if (err)
        res.status(404).send(err);
      // Massage data to display on frontend
      
      res.status(200).json(players);
    });
  });

  router.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '../../public/views/index.html'));
  });

}());