var db = require('../dbconnection') //reference of dbconnection.js
const moment = require('moment')

var Home = {
  createContacts: function (contactDetails, callback) {
    return db.query(
      `INSERT INTO contacts (name,email, subject ,message,created_at) VALUES ("${
        contactDetails.name
      }","${contactDetails.email}","${contactDetails.subject}","${
        contactDetails.message
      }","${moment().format('YYYY-MM-DD HH:mm:ss')}")`,
      callback,
    )
  },

  createContactsTable: function (callback) {
    return db.query(
      'create table IF NOT EXISTS contacts(id INT NOT NULL AUTO_INCREMENT, name VARCHAR(250) NOT NULL, email VARCHAR(250) NOT NULL, subject VARCHAR(250) NOT NULL, message TEXT NOT NULL, created_at DATETIME NOT NULL, PRIMARY KEY ( id ))',
      callback,
    )
  },
}

module.exports = Home
