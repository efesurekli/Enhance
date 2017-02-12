const Sequelize = require('sequelize');
const db = require('./db.js');
const User = require('./User.js');


const Message = db.define('messages', {
  text: Sequelize.STRING,
  location: Sequelize.GEOGRAPHY,
  radius: Sequelize.INTEGER,
  recipients: Sequelize.ARRAY(Sequelize.INTEGER)
});

// Message.sync({force: true}).then(function () {
//   // Table created
//   return Message.create();
// });

User.hasMany(Message, { as: 'messages' });
Message.belongsTo(User);

module.exports = Message;

