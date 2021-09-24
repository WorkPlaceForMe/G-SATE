var mysql = require("mysql");
require("dotenv").config({ path: "./config.env" });

var connection = mysql.createPool({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
 // port: 3307,
});
module.exports = connection;
