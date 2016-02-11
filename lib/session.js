"use strict";

var uuid = require('uuid');
var config = require('../config');

var sessions = {};

exports.checkSession = function(req, res) {
  var clientCookie = req.headers.cookie;
  var cookies = parseCookie(clientCookie);
  var cookie = cookies[config.session.name] || "";
  var session = null;
  if (cookie) {
    session = getSession(cookie);
    if (res.locals.authData && res.locals.authData.authorization && session && session.authData && session.authData.accessToken) {
      if (res.locals.authData.authorization !== session.authData.accessToken)
        session = null;
    }

    if (session) {
      req.session = session;
    }
  }

  if (!session) {
    // Create session
    session = {};
    var sessionId = uuid.v4();
    var newCookie = secureCookie(config.session.name + "=" + sessionId + '; path=/; expires=' + (new Date(+new Date + 3600 * 1000)).toGMTString());
    session.cookie = newCookie;
    session.id = sessionId;
    req.session = session;
    res.cookie(newCookie);
    sessions[req.session.id] = session;
    if (cookie)
      setSessionCookie(req, res);
  }
};

var setSessionCookie = function(req, res) {
  var clientCookie = req.headers.cookie;
  var cookies = parseCookie(clientCookie);
  var cookie = cookies[config.session.name] || "";
  if (cookie && cookie.indexOf(req.session.id) === -1) {
    var newCookie = secureCookie(config.session.name + "=" + req.session.id + '; path=/; expires=' + (new Date(+new Date + 3600 * 1000)).toGMTString());
    res.cookie(newCookie);
    req.session.cookie = newCookie;
  }
}

exports.setSessionCookie = setSessionCookie;

exports.updateSessionWithID = function(req, res) {
  var session = req.session;
  delete sessions[session.id];
  session.id = req.session.sessionId;
  setSessionCookie(req, res);
  sessions[req.session.sessionId] = session;
}

exports.logout = function(req, res) {
  delete sessions[req.session.id];
  delete res.locals['user'];
  req.session = null;
};

function secureCookie(value) {
  var secure = config.https;
  var prefix = (value[value.length - 1] === ";") ? "" : ";";
  if (secure) value += prefix + 'Secure;';
  value += prefix + 'HttpOnly;';
  return value;
}

function getSession(key) {
  return sessions[key];
}

function parseCookie(cookie) {
  var cookies = cookie || "";
  var res = {};
  cookies.split(";").forEach(function(cookie) {
    var parts = cookie.split("=");
    if ((parts.length >= 2) && parts[0] && parts[1]) {
      res[parts[0].trim()] = parts[1].trim();
    }
  });
  return res;
}