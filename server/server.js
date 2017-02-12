const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const breadRouter = require('./breadRouter');
const session = require('express-session');

const SequelizeSessionStore = require('connect-session-sequelize')(session.Store);
// app.use(session({
//     secret: 'keyboard cat',
//     cookie: {
//         maxAge: 30000 // 2 seconds for testing
//     },
//     store: store
// }));

const db = require('./database/db.js');

db.authenticate().then(() => {
  console.log('connected to the database');
  // db.sync();
  // initializeDb(); // you don't do that once the db is deployed.
}).catch((error) => {
  console.log('cannot connect to the db');
  throw error;
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../client/public')));
app.use(express.static(path.join(__dirname, '../client/dist')));

app.use('/', breadRouter);

const server = app.listen(3000, function () {
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

