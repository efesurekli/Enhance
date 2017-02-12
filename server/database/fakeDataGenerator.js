const faker = require('faker');
const db = require('./db.js');
const User = require('./User.js');
const Message = require('./Message.js');

// volume of data:
const userNumber = 50;
const messageNumber = 150;

// constants for all users:

const latitude1 = 37.697676;
const longitude1 = -122.49258;
const latitude2 = 37.791608;
const longitude2 = -122.391129;


let users = [];
let messages = [];

// random generator helpers:
const generateCategoryId = function generateCategory() {
  // const categoryEnum = ['crime', 'waitTime', 'hazard', 'publicEvent'];
  return Math.floor(Math.random() * 4) + 1; //should be 1 -4
};

const generateRandomId = function generateRandomId(range) {
  return Math.floor(Math.random() * range) + 1; // starts from 1
};

const generateRandomPast = function generateRandomPast() {
  // all data is generated in the last month (720 hours)
  const randomHour = Math.floor(Math.random() * 720);
  return new Date(Date.now() - (randomHour * 60 * 60 * 1000));
};

const generateRandomCoordinates = function generateRandomCoordinates(lat1, lat2, lng1, lng2) {
  // san francisco area:
  // left bottom corner : 37.697676, -122.49258 (lat1, lng1)
  // right top corner: 37.791608 -122.391129 (lat2, lng2)
  const lat = Math.floor((Math.random() * (lat2 - lat1)) * 1000000) / 1000000;
  const lng = Math.floor((Math.random() * (lng2 - lng1)) * 1000000) / 1000000;

  // add a random increment to the left bottom corner:
  return [lat1 + lat, lng1 + lng];
};

// Database helpers:

// Generate datasets:

for (let i = 0; i < userNumber; i++) {
  let username = faker.internet.userName();
  let radius =  Math.floor(Math.random() * 1500);
  users.push({
    username,
    radius
  });
}

for (let i = 0; i < messageNumber; i++) {
  let text = faker.random.words();
  let userId = generateRandomId(userNumber);
  let updatedAt = generateRandomPast();
  let username = faker.internet.userName();
  let location = {
    type: 'Point',
    coordinates: generateRandomCoordinates(latitude1, latitude2, longitude1, longitude2),
  };
  let recipients = [1, 2, 3, 4];
  messages.push({
    username,
    userId,
    text,
    location,
    recipients
  });
};


db.sync({ force: true })
.then(function() {
  return User.bulkCreate(users);
})
.then(function() {
  return Message.bulkCreate(messages);
})
.catch(function(error) {
  throw error;
});
