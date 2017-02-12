var express = require('express');
var breadRouter = express.Router();
const path = require('path');
var passport = require('passport');
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;

const db = require('./database/db.js')
const Message = require('./database/Message.js')

passport.use(new LocalStrategy(
  function(username, password, done) {
    //gotta define this stuff what happens
  }
));

breadRouter.get('/nearbyMessages', function (req, res) { //can come from device or website, returns nearby messages
  var location = {};
  var responses;
  location.user = req.user.userID;
  location.location = req.body.location;
  //send this location object to efe
  //bind any responses to res and send
  res.status(200).send(res);
});

breadRouter.post('/messages', function (req, res) { //mosts to messages
  var message = {};
  // message.userID = req.user.userID;
  message.location = req.body.location;
  message.message = req.body.message;
  message.recipients = req.body.recipients;
  message.radius = req.body.radius;

  console.log(message);

  Message.create({
      text: message.message,
      location: message.location,
      radius: message.radius, 
      recipients: message.recipients
  }).then(function(data) {
    console.log(data.get({
      plain: true
    }))
    res.sendStatus(200);
  });

  //send this message to database;
    //on successful post, send confirmation
});

breadRouter.get('/messages', function (req, res) {  //returns all messages by user
  var userID = req.user.userID;
  //query database for all messages regarding user
  //put result in array
  //send back to client
});

breadRouter.get('/yelp', function (req, res) {
  //get yelp reviews
    //response: yelp object
  var address = req.body.location;
});

breadRouter.post('/login', passport.authenticate('local', {successRedirect: '/', failureRedirect: '/login', failureFlash: 'login didn\'t work'}),
  function (req, res) {
  res.redirect('/');
})

module.exports = breadRouter;
