(function() {

  'use strict';
  var express = require('express');
  var router = express.Router();
  var config = require('../config');
  var helpers = require('../lib/helpers');
  var sessionManager = require('../lib/session');
  var uuid = require('uuid');
  var async = require('async');
  var path = require('path');

  module.exports = router;

  router.get('/', ensureSession, function(req, res) {
    res.redirect('/login');
  });

  router.get('/login', ensureSession, function(req, res) {
    res.sendFile(path.join(__dirname + '../../public/views/login.html'));
  });

  router.post('/authenticate', ensureSession, function(req, res) {
    helpers.authenticate(req.body.username, req.body.password, function(err, authData) {
      if (err)
        return res.status(401).json({error: 'Authentication failed, please check your username and password.'})
      console.log(authData.user, "Successful authentication");
      req.session.authData = authData;
      res.locals.authData = authData;

      req.session.sessionId = uuid.generate();
      sessionManager.updateSessionWithID(req, res);
      res.status(200).json({user: authData});
    });
  });

  router.get('/logout', ensureSession, function (req, res) {
      console.log(req.session.authData.user, "Successful logout");
      sessionManager.logout(req, res);
      res.end();
  });

  router.get('/checkit', function(req, res) {
    res.sendStatus(200);
    res.end();
  });

  router.use(ensureSession);
  router.use(ensureAuthenticated);

  router.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '../../public/views/index.html'));
  });

  function ensureAuthenticated(req, res, next) {
    if (req.session.authData)
      return next();
    else
      res.sendStatus(401);
  }

  function ensureSession(req, res, next) {
    sessionManager.checkSession(req, res);
    sessionManager.setSessionCookie(req, res);
    next();
  }

}());