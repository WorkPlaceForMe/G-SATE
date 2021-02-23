var db=require('../dbconnection'); //reference of dbconnection.js
require('dotenv').config({ path: './config.env'});
var fs = require('fs');

var User={

  users:function(callback){
  return db.query('SELECT * FROM users ORDER BY id DESC',callback);
  },

  search:function(search,callback){
    var look = '%'+search+'%';
    return db.query('SELECT * FROM users where name LIKE ? or gender LIKE ? or age_group LIKE ? or role LIKE ?',[look,look,look,look],callback);
    },
  getOne:function(id,callback){
  return db.query('SELECT * FROM users WHERE uuid = ?',[id],function(err, response){
    return callback(err,response[0])
  });
  },
  
  create:function(user,callback){
    if (!fs.existsSync(process.env.resources + user.uuid)){
      fs.mkdirSync(process.env.resources + user.uuid);
  }
    let writeStream = fs.createWriteStream(process.env.resources + user.uuid + '/attr.json');
    writeStream.write(JSON.stringify(user));
  return db.query('INSERT INTO users values (?,?,?,?,?,?,?,?)',[0,user.name,user.gender,user.age_group,user.role,user.category,user.uuid,user.errors],callback);
  },

  delete:function(id,callback){
   return db.query('DELETE FROM users WHERE uuid = ?',[id],callback);
 },

 update:function(id,user,callback){
 return db.query("UPDATE users set name=?,gender=?,age_group=?,role=?,category=? where uuid=?",[user.name,user.gender,user.age_group,user.role,user.category,id],callback);
}
};

 module.exports=User;
