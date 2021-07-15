var db = require('../dbconnection'); //reference of dbconnection.js

var Datasets = {

    UnAnnotatedList: function(which, callback) {
        return db.query(`SELECT * FROM datasets where processed="Yes" and type= 'zip' and class='${which}' ORDER BY name asc`, callback);
    },

    annotatedList: function(which, callback) {
        return db.query(`SELECT * FROM datasets where processed="Yes" and type= 'video' and class='${which}' ORDER BY name asc`, callback);
    },

    listOne: function(name, callback) {
        return db.query(`SELECT * FROM datasets where processed="Yes" and name='${name}' ORDER BY name asc`, callback);
    },

    listOneByTypeVideo: function(name, callback) {
        return db.query(`SELECT * FROM datasets where processed="Yes" and type="video" and name='${name}' ORDER BY name asc`, callback);
    },

    add: function(data, callback) {
        return db.query('INSERT INTO datasets values (?,?,?,?,?,?,?,?,?)', [data.cam_id, data.clientId, data.name, data.path, data.processed, data.class, data.type, data.uploaded, data.snippet_id], callback);
    },

    delete: function(id, callback) {
        return db.query('DELETE FROM datasets WHERE snippet_id = ?', [id], callback);
    }


};

module.exports = Datasets;