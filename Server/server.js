var express = require('express');
var app = express();
const path = require('path');
var bodyParser = require('body-parser');
var breadRouter = require('./breadRouter');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, '../client/public')));
// app.use(express.static(path.join(__dirname, '../client/dist')));

app.use('/', breadRouter);

var server = app.listen(3000, function () {
  console.log('Breadcrumbs listening on 3000 yo');
});





// location check for message
//   -get request with location param
//   -from N
// message post for message
//   -post request location + message param
//   -store in database
//   -From website or from N
// yelp retrieve reviews
//   -params for information
//   -default settings available
//   -request to yelp API with address
//   -from N
// text
// location
// time (attached on server)
// expiration
// user
// receivers

