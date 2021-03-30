var db = require('../dbconnection'); //reference of dbconnection.js

var Algorithm = {

    list: function (callback) {
        return db.query('SELECT * FROM algorithms ORDER BY id', callback);
    },

    fetchAlgoData: function (data) {
        return new Promise((resolve, reject) => {
          db.query(`SELECT * FROM ${data.table} where snippet_id='${data.snippet_id}' ORDER BY time asc`, function (error, results, fields) {
            if (error) {console.log(error);resolve([])};
            resolve(results);
          });
        })
        //return db.query(`SELECT * FROM ${data.table} where snippet_id='${data.snippet_id}' ORDER BY time asc`, callback);
    }
};

module.exports = Algorithm;