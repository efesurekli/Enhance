var express = require('express');
var breadRouter = express.Router();
const path = require('path');
var passport = require('passport');
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;
const { getMessages, insertMessage } = require('./database/utils.js');

const db = require('./database/db.js')
const Message = require('./database/Message.js')

passport.use(new LocalStrategy(
  function(username, password, done) {
    //gotta define this stuff what happens
  }
));

// changed get->post
breadRouter.get('/nearbyMessage/:lat/:lng', function (req, res) { //can come from device or website, returns nearby messages
  console.log('req here',req.params);
  const radius = 100; // 100 meters
  const location = { latitude: req.params.lat, longitude: req.params.lng };
  getMessages(location, radius).then((messages) => {
    res.send(messages);
    console.log(messages);
    // test case with message in curr location
    // var sample = {
    //   messages: [{
    //     username: "Susan",
    //     message: "Hi there"
    //   }]
    // }
    // res.send(sample);
  });
  // location.user = req.user.userID;
  // location.location = req.body.location;
  //send this location object to efe
  //bind any response to res and send

});

breadRouter.post('/messages', function (req, res) { //mosts to messages
  var message = {};
  message.location = req.body.location;
  message.text = req.body.text;
  message.username = req.body.username;
  insertMessage(message).then((mes) => {
    console.log(mes);
    res.send(200)
  });
});

breadRouter.get('/messages/:lat/:lng', function (req, res) {  //returns all messages by user
  // const userID = req.user.userID;
  const location = { latitude: req.params.lat, longitude: req.params.lng };
  const rad = 5000; //can set it as a setting
  getMessages(location, rad).then(messages => {
    res.send(messages);
  });
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
