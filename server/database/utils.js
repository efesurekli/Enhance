const db = require('./db.js');
const Promise = require('bluebird');
const User = require('./User.js');
const Message = require('./Message.js');


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
const getMessages = function getMessages(location, radius) {
  return new Promise((resolve, reject) => {
    db.query(stdWithinquery('messages', 'location', location.latitude, location.longitude, radius),
      { type: db.QueryTypes.SELECT, model: Message })
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
      radius,
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
  const { text, location, username } = message;
  return new Promise((resolve, reject) => {
    Message.create({
      username,
      text,
      location: { type: 'Point', coordinates: [location.latitude, location.longitude] },
    }).then(message => {
      resolve(message);
    }).catch(reject);
  });
};

module.exports = {
  getMessages,
  insertMessage
};





