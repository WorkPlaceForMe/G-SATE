var db = require('../dbconnection') //reference of dbconnection.js

var Algorithm = {
  list: function (callback) {
    return db.query('SELECT * FROM algorithms ORDER BY id', callback)
  },

  fetchAlgoData: function (data) {
    console.log('===================> ', data)
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM ${data.table} where snippet_id='${data.snippet_id}' ORDER BY time asc`,
        function (error, results, fields) {
          if (error) {
            console.log(error)
            resolve([])
          }
          resolve(results)
        },
      )
    })
    //return db.query(`SELECT * FROM ${data.table} where snippet_id='${data.snippet_id}' ORDER BY time asc`, callback);
  },

  create: function (algoDetails, callback) {
    return db.query(
      `INSERT INTO algorithms (id,name, available ,custom_trained) VALUES ("${algoDetails.id}","${algoDetails.name}","${algoDetails.available}","1")`,
      callback,
    )
  },

  getOne: function (name, callback) {
    return db.query(`SELECT * FROM algorithms where name='${name}'`, callback)
  },

  createAlgorithmTable: function (tableName, callback) {
    return db.query(
      `create table IF NOT EXISTS ${tableName}_gsate(track_id VARCHAR(250) NOT NULL, time DATE NOT NULL, class VARCHAR(250) NOT NULL, camera_name VARCHAR(250), cam_id VARCHAR(250), id_account VARCHAR(250), id_branch VARCHAR(250), image_path VARCHAR(500), x1 DECIMAL(6,4), x2 DECIMAL(6,4), y1 DECIMAL(6,4), y2 DECIMAL(6,4), cam_width DECIMAL(6,4), cam_height DECIMAL(6,4), snippet_id VARCHAR(250))`,
      callback,
    )
  },
}

module.exports = Algorithm
