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

  router.get('/api/summonerLadderRankings', function(req, res) {
    helpers.getSummonerRankings(function(err, summoners) {
      if (err)
        res.status(404).send(err);
      else
        res.status(200).json(summoners);
    });
  });

  router.post('/api/summonerSearch', function(req, res) {
    helpers.getSummonerByName(req.body.summonerName.toLowerCase(), function(err, summoner) {
      if (err)
        res.status(404).send(err);
      else
        res.status(200).json(summoner);
    });
  });

  router.get('/api/summonerById/:id', function(req, res) {
    helpers.getSummonerData(req.params.id, function(err, summoner) {
      if (err)
        res.status(404).send(err);
      else
        res.status(200).json(summoner);
    });
  });
  
  router.get('/api/summonerChampions/:id', function(req, res) {
    helpers.getSummonerChampionData(req.params.id, function(err, champions) {
      if (err)
        res.status(404).send(err);
      else
        res.status(200).json(champions);
    });
  });

  router.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '../../public/views/index.html'));
  });

}());