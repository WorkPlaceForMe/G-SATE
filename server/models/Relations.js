var db=require('../dbconnection'); //reference of dbconnection.js

var Relations={

    getRels:function(uuid,callback){
        return db.query('SELECT * FROM camera_roi_algo WHERE camera_id = ?',[uuid],callback);
    },

    getAllForReal:function(callback){
        return db.query('SELECT * FROM camera_roi_algo',callback);
    },

create:function(relation,callback){
    return db.query('INSERT INTO camera_roi_algo values (?,?,?,0,?)',[relation.camera_id,relation.algo_id,relation.roi_id,relation.atributes],callback);
    },
    delete:function(id,callback){
        return db.query('DELETE FROM camera_roi_algo WHERE id = ?',[id],callback);
      },
      update:function(id,relation,callback){
        return db.query("UPDATE camera_roi_algo set atributes=? where id=?",[relation.atributes,id],callback);
       }
};

 module.exports=Relations;
