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
      `create table IF NOT EXISTS ${tableName}_gsate(track_id VARCHAR(250), time DATE, class VARCHAR(250), camera_name VARCHAR(250), cam_id VARCHAR(250), id_account VARCHAR(250), id_branch VARCHAR(250), image_path VARCHAR(500), x1 VARCHAR(250), x2 VARCHAR(250), y1 VARCHAR(250), y2 VARCHAR(250), cam_width VARCHAR(250), cam_height VARCHAR(250), snippet_id VARCHAR(250))`,
      callback,
    )
  },

  getCustomAlgorithms: function (callback) {
    return db.query(
      `SELECT * FROM algorithms where custom_trained='1'`,
      callback,
    )
  },

  getCustomAlgorithmById: function (id, callback) {
    return db.query('SELECT * FROM algorithms where id = ?', [id], callback)
  },

  deleteAlgorithm: function (id, callback) {
    return db.query('DELETE FROM algorithms where id = ?', [id], callback)
  },

  dropTable: function (tableName, callback) {
    return db.query(`DROP TABLE IF EXISTS ${tableName}`, callback)
  },
}

module.exports = Algorithm
