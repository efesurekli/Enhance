
const db = require('./db.js');
const Promise = require('bluebird');
const User = require('../models/User.js');
const message = require('../models/message.js');
const Vote = require('../models/Vote.js');
const Category = require('../models/Category.js');
const Subscription = require('../models/Subscription.js');
const bcrypt = require('bcrypt');


// Helper functions for db queries:
const querymessages = (userId, location, category, radius) => {
  const { latitude, longitude } = location;
  // table that contains geolocation column:
  const table = 'messages';
  // geolocation column:
  const geoCol = 'location';

  // Postgres query:
  // select * from messages where "categoryId" in (select "categoryId" from subscriptions where "userId"=1);
  // select * from messages where ST_DWithin(location,'POINT(37.7806521 -122.4070723)',(select radius from users where id=2));

  return "SELECT id, title, description, location, \"voteCount\", \"categoryId\" FROM " + table
  + " where \"categoryId\" in" + "(select \"categoryId\" from subscriptions where \"userId\"=" + userId + ")"
  + " AND " + "ST_DWithin(" + geoCol + "," + "'POINT(" + latitude + " " + longitude + ")',"
  + "(select radius from users where id=" + userId + ")" + ")"
};

// accept geoJson format
const coordinateTransform = function coordinateTransform(location) {
  const coords = location.coordinates;
  coords[1] = (coords[1] + 180) * (-1);
  return { type: 'Point', coordinates: coords };
};

const stdWithinquery = function stdWithinquery(table, geoCol, lat, lng, radius) {
  // postgres query:
  // "SELECT * FROM messages
  // WHERE ST_DWithin(location, 'POINT(" + lat + " " + lng + ")', " + rad + ")";
  return "SELECT * FROM " + table
  + " WHERE ST_DWithin(" + geoCol + "," + "'POINT(" + lat + " " + lng + ")'," + radius + ")";
};

const overriddenBulkCreate = function overriddenBulkCreate(model, entries) {
  return new Promise(function(resolve, reject){
    Promise.all(entries.map(entry => model.create(entry, { raw: true, silent: true })))
      .then(resolve).catch(reject);
  });
};

// Exported controller functions:

// last two arguments are overload functions
// userId: integer
// categoryId: integer
// location: { latitude (float), longitude (float) }
// radius: float (meters) (ex: 100.0 is 100 meters)
const getMessages = function getMessages(userId, location, category, radius) {
  return new Promise((resolve, reject) => {
    db.query(querymessages(userId, location, category, radius),
      { type: db.QueryTypes.SELECT, model: message })
        .then((results) => {
          resolve(results.map((result) => {
            const message = result.dataValues;
            message.location = coordinateTransform(message.location);
            return message;
          }));
        }).catch(reject);
  });
};

// all inputs are string
// expect subscriptions as an array of category ids.
const insertUser = function insertUser(user, settings) {
  const { username, firstName, lastName, password, email } = user;
  const { radius, subscriptions } = settings;
  return new Promise((resolve, reject) => {
    User.create({
      username,
      firstName,
      lastName,
      password,
      radius,
      email,
    }, { individualHooks: true })
    .then((user) => {
      return Category.findAll({
        where: {
          id: {
            in: subscriptions,
          },
        },
      }).then(categories => user.setCategories(categories))
        .catch(reject);
    }).then((subs) => { // resolves into subscriptions
      resolve(subs[0][0].userId);
    }).catch(reject);
  });
};

// { title, description: string;
// userId: integer; location: { latitude (float), longitude (float) } }
const insertMessage = function insertmessage(message) {
  const { title, location, description, userId, categoryId } = message;
  return new Promise((resolve, reject) => {
    message.create({
      title,
      location: { type: 'Point', coordinates: [location.latitude, location.longitude] },
      description,
      voteCount: 0,
      userId,
      categoryId,
    }).then((message) => {
      Subscription.findAll({
        attributes: ['userId'],
        where: {
          categoryId: message.categoryId,
        },
      }).then(userIds => resolve(userIds.map(uid => uid.dataValues.userId), message))
        .catch(reject);
    }).catch(reject);
  });
};

