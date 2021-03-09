var db = require('../dbconnection'); //reference of dbconnection.js

var TrainingModel = {

    //Unsure
    create: function(model, callback) {
        return db.query('INSERT INTO training_model values (?,?,?)', [model.id, model.name, model.version], callback);
    },

    delete: function(id, callback) {
        return db.query('DELETE FROM training_model WHERE id = ?', [id], callback);
    },

    update: function(id, model, callback) {
        return db.query("UPDATE training_model set name=?,version=? where id=?", [model.name, model.version, id], callback);
    }
};

module.exports = TrainingModel;