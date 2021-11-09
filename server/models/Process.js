var db = require('../dbconnection') //reference of dbconnection.js
const moment = require('moment')

var Process = {
  create: function (dataItems, callback) {
    return db.query(
      'INSERT INTO vista_video_process (vista_operation_id, upload_id, subscriptions, timestamp , created_at) VALUES ?',
      [
        dataItems.map((data) => [
          data.id,
          data.upload,
          data.subscriptions,
          moment(new Date(data.timestamp)).format('YYYY-MM-DD HH:mm:ss'),
          moment().format('YYYY-MM-DD HH:mm:ss'),
        ]),
      ],
      callback,
    )
  },
  getByCompletedOrNot: function (value, callback) {
    return db.query(
      'SELECT * FROM vista_video_process WHERE completed = ?',
      [value],
      callback,
    )
  },

  update: function (dataItems, callback) {
    return db.query(
      'UPDATE vista_video_process set result=?,completed=?,completed_at=? where id=?',
      [
        dataItems.result,
        dataItems.completed,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        dataItems.id,
      ],
      callback,
    )
  },

  // update: function (dataItems, callback) {
  //   return db.query(
  //     "ALTER TABLE `vista_video_process` MODIFY COLUMN `completed` enum('YES','NO','FAILED') default 'NO';",
  //     callback,
  //   )
  // },
}

module.exports = Process
