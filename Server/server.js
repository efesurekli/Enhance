var express = require('express');
var app = express();
const path = require('path');
var bodyParser = require('body-parser');
var breadRouter = require('./breadRouter');
var session = require('express-session');

const SequelizeSessionStore = require('connect-session-sequelize')(session.Store);

const db = require('./database/db.js');

// const store = new SequelizeSessionStore({
//     db: db,
//     tablename: 'sessions' // optional. Defaults to 'sessions'
// });

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// app.use(session({
//     secret: 'keyboard cat',
//     cookie: {
//         maxAge: 30000 // 2 seconds for testing
//     },
//     store: store
// }));

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

