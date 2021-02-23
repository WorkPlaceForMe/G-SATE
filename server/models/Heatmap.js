var db=require('../dbconnection');

var hm={
    list1:function(camera_id,callback){
    return db.query("SELECT DATE_FORMAT(timestamp,'%d/%m/%y %H:%i') as date, x, y FROM heatmap where camera_id = ?;",[camera_id],callback);
    },
    choosen1:function(camera_id,st,end,callback){
    return db.query("SELECT DATE_FORMAT(timestamp,'%d/%m/%y %H:%i') as date, x, y, dwell FROM heatmap where timestamp >= ? and  timestamp <= ? and camera_id = ? order by date asc;",[st,end,camera_id],callback);
    },
    dwell1:function(camera_id,st,end,dwell,callback){
    return db.query("SELECT DATE_FORMAT(timestamp,'%d/%m/%y %H:%i') as date, x, y, dwell FROM heatmap where timestamp >= ? and  timestamp <= ? and dwell = ? and camera_id = ? order by date asc;",[st,end,dwell,camera_id],callback);
    },
    zone:function(callback){
        return db.query("SELECT zone FROM map group by zone;",callback);
    }
};


module.exports=hm;