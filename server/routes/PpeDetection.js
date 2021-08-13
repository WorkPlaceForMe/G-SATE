const express = require('express');
const router = express.Router();
const cp = require("child_process");

router.post('/object/detection', function (req, res, next) {
  if(!req.body.image) {
  	res.status(400).send('Image is required');
  }

  const image = req.body.image;
  const command = `cd ./objdet/darknet && ./darknet detector test ../../../../kartik/graymatics.data ../../../../kartik/yolov3_deploy.cfg ../../../../kartik/yolov3_deploy.weights ${image} -ext_output`;

  cp.exec(command, (err, data) => {
  	if(err) {
  	  res.status(400).send(err);
  	}

  	console.log(data);
  })
});