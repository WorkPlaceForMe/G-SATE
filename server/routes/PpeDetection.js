const express = require('express');
const router = express.Router();
const cp = require("child_process");

router.post('/object/detection', function (req, res, next) {
  if(!req.body.image) {
  	res.status(400).send('Image is required');
    return;
  }

  const image = req.body.image;
  let dir = "./objdet/darknet/data/" + image.split("/")[7];
  const command = `cd ./objdet/darknet && ./darknet detector test ../../../../kartik/graymatics.data ../../../../kartik/yolov3_deploy.cfg ../../../../kartik/yolov3_deploy.weights ${image} -ext_output`;

  saveImg(image, dir, function (err, data) {
    cp.exec(command, (err, data) => {
      console.log("Err LOG BY INT: ", err);
      console.log("Data LOG BY INT: ", data);
      
      if(err) {
        res.status(400).send(err);
      }

      console.log("type of data>>>>>>>>", typeof data);
      console.log("data>>>>>>>>>>>>>>", data);
      let result = [];

      console.log("data splitted >>>>>>>>>>>", data.split("\n"));
      data.split("\n").forEach((item) => {
        const NUMERIC_REGEXP = /[-]{0,1}[\d]*[.]{0,1}[\d]+/g;
        const itemMatched = item.match(/\(([^)]+)\)/);
        let className = '';
        
        if(item.includes('people')) {
          className = 'people';
        }

        if(itemMatched && Array.isArray(itemMatched)) {
          const numbers = itemMatched[1].match(NUMERIC_REGEXP);

          if(numbers && numbers.length > 0) {
            result.push({
              left: numbers[0],
              top: numbers[1],
              width: numbers[1],
              height: numbers[1],
              className: className,
            });
          }
        } else {
          console.log("element >>>>>>>>>>>>", ele);
          res.status(400).json({
            message: 'Invalid response from internal command!',
            commandRes: data
          });
        }
      });
      if (fs.existsSync(dir)) {
        fs.unlinkSync(dir);
      }
      res.json(result);
    })
  });
});

let saveImg = function (uri, filePath, callback) {
  try {
    let options = {
      url: uri,
      strictSSL: false,
    };
    request.head(options, function (err, res, body) {
      console.log('SAVE_IMAGE', err, res, body);

      request(options)
        .pipe(fs.createWriteStream(filePath))
        .on("close", function () {
          callback();
        });
    });
  } catch (err) {
    console.log("Error>>>>>>>>>", err);
  }
};

module.exports = router;