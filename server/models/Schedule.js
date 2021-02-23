var db=require('../dbconnection'); //reference of dbconnection.js

var Schedule={


getSchedule:function(user_id, day, callback){
return db.query('SELECT * FROM schedule WHERE user_id = ? and day = ?',[user_id, day],function(err, response){
  return callback(err,response)
});
},
getAllSchedule:function(user_id,callback){
return db.query('SELECT * FROM schedule WHERE user_id = ?',[user_id],function(err, response){
  return callback(err,response)
});
},
  create:function(day,callback){
  return db.query("INSERT INTO schedule values (?,?,?,?,?)",[0,day.user_id,day.day,day.entrance,day.leave],callback);
  },

  delete:function(user_id,callback){
   return db.query('DELETE FROM schedule WHERE user_id = ?',[user_id],callback);
 },

 update:function(user_id,day,callback){
    return db.query("UPDATE schedule SET entrance=?, leave_time = ? WHERE user_id=? and day=?",[day.entrance,day.leave, user_id, day.day],callback);
 },

};

 module.exports=Schedule;
