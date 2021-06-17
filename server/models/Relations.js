var db = require('../dbconnection'); //reference of dbconnection.js

var Relations = {

    getRels: function (uuid, callback) {
        return db.query('SELECT * FROM relations WHERE camera_id = ? and snippet_id is null', [uuid], callback);
    },

    getRelsFromSnippetId: function (uuid, callback) {
        return db.query('SELECT * FROM relations WHERE snippet_id = ?', [uuid], callback);
    },

    getAllForReal: function (callback) {
        return db.query('SELECT * FROM relations', callback);
    },

    create: function (relation, callback) {
        return db.query('INSERT INTO relations values (?,?,?,?,?,?,?,?,?,?,?,?)', [relation.id,relation.camera_id, relation.algo_id, relation.snippet_id, relation.roi_id, relation.atributes, relation.id_account, relation.id_branch, relation.stream, relation.createdAt, relation.updatedAt, relation.http_out], callback);
    },

    delete: function (id, callback) {
        return db.query('DELETE FROM relations WHERE snippet_id = ?', [id], callback);
    },

    /**
     * Delete all the relations records by camera ID
     */
    deleteByCameraId: function(cameraId, callback) {
      return db.query('DELETE FROM relations WHERE camera_id = ?', [cameraId], callback);
    },

    update: function (id, relation, callback) {
        return db.query("UPDATE relations set atributes=? where id=?", [relation.atributes, id], callback);
    }
};

module.exports = Relations;