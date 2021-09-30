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
}

module.exports = Process
