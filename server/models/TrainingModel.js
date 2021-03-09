var db=require('../dbconnection'); //reference of dbconnection.js

var Algorithm={

list:function(callback){
return db.query('SELECT * FROM algorithms ORDER BY id', callback);
}
};

 module.exports=Algorithm;
