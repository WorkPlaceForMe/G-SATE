var db=require('../dbconnection'); //reference of dbconnection.js

var Face={

list:function(callback){
return db.query('SELECT * FROM fr ORDER BY time DESC LIMIT 50',callback);
},

 countBy:function(age,callback){
return db.query("SELECT DATE_FORMAT(time,'%m/%y') as date, COUNT(*) as cnt FROM fr WHERE age = ? GROUP BY DATE_FORMAT(time,'%m/%y') ORDER BY DATE_FORMAT(time,'%m/%y') DESC",[age],callback);
},

countAll:function(callback){
return db.query('SELECT age, count(*) as cnt FROM fr GROUP BY age',callback);
},

countEmotion:function(callback){
return db.query('SELECT emotion, count(*) as cnt FROM fr GROUP BY emotion',callback);
}

};

 module.exports=Face;
