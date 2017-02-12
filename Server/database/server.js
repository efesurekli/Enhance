const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./db.js');

// middlewares

app.use(bodyParser.json());

// start the app

app.listen(3000, '127.0.0.1', () =>{
  console.log('listening at 3000');
});

db.authenticate().then(() => {
  console.log('connected to the database');
  // db.sync();
  // initializeDb(); // you don't do that once the db is deployed.
}).catch((error) => {
  console.log('cannot connect to the db');
  throw error;
});

app.get('/', (req, res) => {
  res.send('hello world 2');
});


