let db = require('../dbconnection'); //reference of dbconnection.js

let Annotation = {
    //Unsure
    getModelDetails: function(callback) {
        return db.query('SELECT * FROM training_model ORDER BY name ASC', callback);
    },

    createImage: function(details, callback) {
        return db.query('INSERT INTO customer_training_details values (?,?,?,?,?,?,?,?,?)', [details.id, details.datasetName, details.date, details.emailAddress, details.contactName, details.model, details.version,details.path, details.processed], callback);
    },

    createObject: function(details, callback) {
        return db.query('INSERT INTO object_detection_training_details values (?,?,?,?,?,?,?,?,?)', [details.id, details.datasetName, details.date, details.emailAddress, details.contactName, details.model, details.version, details.path, details.processed], callback);
    },
};

module.exports = Annotation;