var db = require('../dbconnection') //reference of dbconnection.js
require('dotenv').config({ path: './config.env' })
var fs = require('fs')

var User = {
  users: function (callback) {
    return db.query('SELECT * FROM users ORDER BY id DESC', callback)
  },

  search: function (search, callback) {
    var look = '%' + search + '%'
    return db.query(
      'SELECT * FROM users where name LIKE ? or gender LIKE ? or age_group LIKE ? or role LIKE ?',
      [look, look, look, look],
      callback,
    )
  },
  getOne: function (id, callback) {
    return db.query('SELECT * FROM users WHERE uuid = ?', [id], function (
      err,
      response,
    ) {
      return callback(err, response[0])
    })
  },

  create: function (user, callback) {
    if (!fs.existsSync(process.env.resources + user.uuid)) {
      fs.mkdirSync(process.env.resources + user.uuid)
    }
    let writeStream = fs.createWriteStream(
      process.env.resources + user.uuid + '/attr.json',
    )
    writeStream.write(JSON.stringify(user))
    return db.query(
      'INSERT INTO users values (?,?,?,?,?,?,?,?)',
      [
        0,
        user.name,
        user.gender,
        user.age_group,
        user.role,
        user.category,
        user.uuid,
        user.errors,
      ],
      callback,
    )
  },

  delete: function (id, callback) {
    return db.query('DELETE FROM users WHERE uuid = ?', [id], callback)
  },

  update: function (id, user, callback) {
    return db.query(
      'UPDATE users set name=?,gender=?,age_group=?,role=?,category=? where uuid=?',
      [user.name, user.gender, user.age_group, user.role, user.category, id],
      callback,
    )
  },

  createNewUser: function (userDetails, callback) {
    return db.query(
      `INSERT INTO users (name, email, password, uuid, mobileNumber, address, role, createdAt, verificationOTP, otpExpiredAt) VALUES ("${userDetails.name}","${userDetails.email}","${userDetails.password}","${userDetails.uuid}","${userDetails.mobileNumber}","${userDetails.address}","${userDetails.role}","${userDetails.createdAt}","${userDetails.verificationOTP}","${userDetails.otpExpiredAt}")`,
      callback,
    )
  },

  getUserByEmail: function (email, callback) {
    return db.query('SELECT * FROM users WHERE email = ?', [email], callback)
  },

  getUserById: function (id, callback) {
    return db.query('SELECT * FROM users WHERE id = ?', [id], callback)
  },

  getUsersByAdmin: function (callback) {
    return db.query(
      `SELECT id,name,role,uuid,email,mobileNumber,address,createdAt,startDate,endDate FROM users WHERE role IN ("BRANCH", "CLIENT", "USER") ORDER BY id DESC`,
      callback,
    )
  },

  getAdminUserById: function (id, callback) {
    return db.query(
      'SELECT * FROM users WHERE id = ? AND role = ?',
      [id, 'ADMIN'],
      callback,
    )
  },

  updateAccessibility: function (data, callback) {
    return db.query(
      'UPDATE users set startDate=?,endDate=? where id=?',
      [data.startDate, data.endDate, data.id],
      callback,
    )
  },

  verifyOTPByEmail: function (data, callback) {
    return db.query(
      'SELECT * FROM users WHERE email = ? AND verificationOTP = ?',
      [data.email, data.verificationOTP],
      callback,
    )
  },

  updateVerificationStatus: function (data, callback) {
    return db.query(
      'UPDATE users set verificationStatus=? where id=?',
      [data.status, data.id],
      callback,
    )
  },

  updateVerificationOTP: function (data, callback) {
    return db.query(
      'UPDATE users set verificationOTP=?, otpExpiredAt=? where id=?',
      [data.verificationOTP, data.otpExpiredAt, data.id],
      callback,
    )
  },
}

module.exports = User
