var db = require('../dbconnection') //reference of dbconnection.js
const moment = require('moment')

var Settings = {
  createSMTP: function (data, callback) {
    return db.query(
      `INSERT INTO settings (adminId, email, password, createdAt) VALUES ("${
        data.adminId
      }","${data.email}","${data.password}","${moment().format(
        'YYYY-MM-DD HH:mm:ss',
      )}")`,
      callback,
    )
  },

  createSettingsTable: function (callback) {
    return db.query(
      'create table IF NOT EXISTS settings(id INT NOT NULL AUTO_INCREMENT, adminId INT NOT NULL, email VARCHAR(250) NOT NULL, password VARCHAR(250) NOT NULL, createdAt DATETIME NOT NULL, updatedAt DATETIME DEFAULT NULL, PRIMARY KEY ( id ))',
      callback,
    )
  },

  updateSMTP: function (data, callback) {
    return db.query(
      'UPDATE settings set email=?, password=?, updatedAt=? where adminId=?',
      [
        data.email,
        data.password,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        data.adminId,
      ],
      callback,
    )
  },

  getSettingsByAdminId: function (adminId, callback) {
    return db.query(
      'SELECT * FROM settings WHERE adminId = ?',
      [adminId],
      callback,
    )
  },

  getSettingsDetailsByUser: function (callback) {
    return db.query('SELECT * FROM settings', callback)
  },
}

module.exports = Settings
