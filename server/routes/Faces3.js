var express = require('express');
var router = express.Router();
var Face=require('../models/Face');

router.get('/',function(req,res,next){
Face.countEmotion(function(err,rows){
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
