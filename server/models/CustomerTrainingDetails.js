var db = require('../dbconnection'); //reference of dbconnection.js

var CustomerTrainingDetails = {


    create: function(customer, callback) {
        return db.query('INSERT INTO cameras values (?,?,?,?,?,?)', [customer.id, camera.name, camera.rtsp_in, camera.rtsp_out, camera.heatmap_pic, camera.pic_height, camera.pic_width, camera.cam_height, camera.cam_width], callback);
    },

    delete: function(id, callback) {
        return db.query('DELETE FROM cameras WHERE id = ?', [id], callback);
    },

    update: function(id, camera, callback) {
        return db.query("UPDATE cameras set name=?,rtsp_in=?,rtsp_out=? where id=?", [camera.name, camera.rtsp_in, camera.rtsp_out, id], callback);
    }
};

module.exports = CustomerTrainingDetails;