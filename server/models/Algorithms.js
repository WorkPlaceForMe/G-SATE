var db = require('../dbconnection'); //reference of dbconnection.js

var Algorithm = {

    list: function (callback) {
        return db.query('SELECT * FROM algorithms ORDER BY id', callback);
    },

    fetchAlgoData: function (data, callback) {
        return db.query(`SELECT * FROM ${data.table} where cam_id='${data.id}' ORDER BY time asc`, callback);
    }
};

module.exports = Algorithm;