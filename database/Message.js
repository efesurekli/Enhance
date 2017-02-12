const Sequelize = require('sequelize');
const db = require('./db.js');
const User = require('./User.js');


const Message = db.define('Message', {
  text: Sequelize.STRING,
  location: Sequelize.GEOGRAPHY,
});

User.hasMany(Message, { as: 'Messages' });
Message.belongsTo(User);

module.exports = Message;

