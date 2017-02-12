var express = require('express');
const cors = require('cors');
var app = express();
const path = require('path');
var bodyParser = require('body-parser');
var breadRouter = require('./breadRouter');
var session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const Knex = require('knex');
const knex = Knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: '',
        database: 'breadcrumbs'
    }
});
const store = new KnexSessionStore({
    knex: knex,
    tablename: 'sessions' // optional. Defaults to 'sessions'
});

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session({
    secret: 'keyboard cat',
    cookie: {
        maxAge: 30000 // 2 seconds for testing
    },
    store: store
}));

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

