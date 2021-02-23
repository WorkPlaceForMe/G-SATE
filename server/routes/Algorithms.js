var express = require('express');
var router = express.Router();
var Algorithm=require('../models/Algorithms');

router.get('/',function(req,res,next){
    Algorithm.list(function(err,rows){
    if(err)
      {
      res.json(err);
      }
      else
      {
      res.json(rows);
      }
     });
     });

     
 module.exports=router;
    