var db = require('../dbconnection'); //reference of dbconnection.js

var CustomerTrainingDetails = {

    //Unsure
    create: function(details, callback) {
        return db.query('INSERT INTO customer_training_details values (?,?,?,?,?,?,?,?)', [details.id, details.datasetName, details.date, details.time, details.email, details.contactName, details.modelName, details.version], callback);
    },

    delete: function(id, callback) {
        return db.query('DELETE FROM customer_training_details WHERE id = ?', [id], callback);
    },

    update: function(id, details, callback) {
        return db.query("UPDATE customer_training_details set dataset_name=?,date=?,time=?,email=?,contact_name=?,model_name=?,version=? where id=?", [details.datasetName, details.date, details.time, details.email, details.contactName, details.modelName, details.version, id], callback);
    }
};

module.exports = CustomerTrainingDetails;