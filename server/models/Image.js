var db=require('../dbconnection'); //reference of dbconnection.js

var Image={

getSome:function(user_id,callback){
    console.log('***************************************', 'SELECT * FROM images WHERE user_id = ? ORDER BY id DESC',[user_id])
return db.query('SELECT * FROM images WHERE user_id = ? ORDER BY id DESC',[user_id],callback);
},

 create:function(image,callback){
 return db.query('INSERT INTO images values (?,?,?,?)',[0,image.user_id,image.location,image.name],callback);
 },

 delete:function(id,callback){
  return db.query('DELETE FROM images WHERE id = ?',[id],callback);
 }

};

 module.exports=Image;
