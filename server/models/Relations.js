var db=require('../dbconnection'); //reference of dbconnection.js

var Relations={

    getRels:function(uuid,callback){
        return db.query('SELECT * FROM relations WHERE camera_id = ?',[uuid],callback);
    },

    getAllForReal:function(callback){
        return db.query('SELECT * FROM relations',callback);
    },

create:function(relation,callback){
    return db.query('INSERT INTO relations values (?,?,?,0,?)',[relation.camera_id,relation.algo_id,relation.roi_id,relation.atributes],callback);
    },
    delete:function(id,callback){
        return db.query('DELETE FROM relations WHERE id = ?',[id],callback);
      },
      update:function(id,relation,callback){
        return db.query("UPDATE relations set atributes=? where id=?",[relation.atributes,id],callback);
       }
};

 module.exports=Relations;