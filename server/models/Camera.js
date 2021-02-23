var db=require('../dbconnection'); //reference of dbconnection.js

var Camera={

cameras:function(callback){
return db.query('SELECT * FROM cameras ORDER BY name ASC',callback);
},

updRt(id,rtsp,callback){
  return db.query("UPDATE cameras set rtsp_out=? where id=?",[rtsp.rtsp_out,id],callback);
},

cams:function(callback){
  return db.query('SELECT rtsp_in FROM cameras',callback);
  },

getOne:function(id,callback){
return db.query('SELECT * FROM cameras WHERE id = ?',[id],function(err, response){
  return callback(err,response[0])
});
},

  create:function(camera,callback){
  return db.query('INSERT INTO cameras values (?,?,?,?,?,?,?,?,?)',[camera.id,camera.name,camera.rtsp_in,camera.rtsp_out,camera.heatmap_pic,camera.pic_height,camera.pic_width,camera.cam_height,camera.cam_width],callback);
  },

  delete:function(id,callback){
   return db.query('DELETE FROM cameras WHERE id = ?',[id],callback);
 },

 update:function(id,camera,callback){
 return db.query("UPDATE cameras set name=?,rtsp_in=?,rtsp_out=? where id=?",[camera.name,camera.rtsp_in,camera.rtsp_out,id],callback);
}
};

 module.exports=Camera;
