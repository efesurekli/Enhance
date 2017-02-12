var express = require('express');
var breadRouter = express.Router();
const path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');

passport.use(new LocalStrategy(
  function(username, password, done) {
    //gotta define this stuff what happens
  }
));

breadRouter.get('/messages', function (req, res) { //can come from device or website
  var location = {};
  var responses;
  location.user = req.user.userID;
  location.location = req.body.location;
  //send this location object to efe
  //bind any responses to res and send
  res.status(200).send(res);
});

breadRouter.post('/messages', function (req, res) {
  var message = {};
  message.userID = req.user.userID;
  message.location = req.body.location;
  message.message = req.body.message;
  message.recipients = req.body.recipients;
  //send this message to database;
    //on successful post, send confirmation
});

breadRouter.get('/yelp', function (req, res) {
  //get yelp reviews
    //response: yelp object
  var address = req.body.location
});

breadRouter.post('/login', passport.authenticate('local', {successRedirect: '/', failureRedirect: '/login', failureFlash: 'login didn\'t work'}),
  function (req, res) {
  res.redirect('/');
})

module.exports = breadRouter;
