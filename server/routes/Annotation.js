const fs = require("fs");
const express = require("express");
const router = express.Router();
const Annotation = require("../models/Annotation");
//Unsure

router.get("/models", function (req, res, next) {
  Annotation.getModelDetails(function (err, annotation) {
    console.log("get Model");
    if (err) {
      res.json(err);
    } else {
      res.json(annotation);
    }
  });
});

router.post("/confirmed", function (req, res, next) {
  let body = req.body;

  /**
   * Parse body string to JSON
   */
  // const data = JSON.parse(body);
  // let modifiedRes = [];

  // if (data.results) {
  //   for (const i in data.result) {
  //     if (Array.isArray(this.data.results[item])) {
  //       this.data.results[j].forEach((element) => {
  //         // First object
  //         let obj1 = {
  //           x:
  //             (element.boundingBox.left * data.result[i].width) /
  //             data.result[i].res_width,
  //           y:
  //             (element.boundingBox.top * data.result[i].height) /
  //             data.result[i].res_height,
  //         };
  //         console.log(obj1);
  //         // Second object
  //         let obj2 = {
  //           x:
  //             (element.boundingBox.width * data.result[i].width) /
  //             data.result[i].res_width,
  //           y:
  //             (element.boundingBox.height * data.result[i].height) /
  //             data.result[i].res_height,
  //         };
  //         // Third object
  //         let obj3 = {
  //           general_detection: "No",
  //         };
  //         // Fourth object
  //         let obj4 = {
  //           label: element.class,
  //         };

  //         // modifiedRes.push([obj1, obj2, obj3, obj4]);
  //       });
  //     }
  //     // console.log(modifiedRes);
  //   }
  //   // console.log(modifiedRes);
  // }

  let directory =
    process.env.resources2 + "training_details/" + body.datasetName + ".json";
  fs.writeFileSync(directory, JSON.stringify(body.data));
  body.path = directory;
  body.processed = "No";
  Annotation.createImage(body, function (err, annotation) {
    if (err) {
      res.json(err);
    } else {
      res.json(annotation);
      //res.redirect("/camerasList");
    }
  });
});

router.post("/object-detection/confirmed", function (req, res, next) {
  console.log("object detection training confirmed");
  let body = req.body;
  let directory =
    process.env.resources2 + "training_details/" + body.datasetName + ".json";
  fs.writeFileSync(directory, JSON.stringify(body.data));
  body.path = directory;
  body.processed = "No";
  Annotation.createObject(req.body, function (err, annotation) {
    if (err) {
      res.json(err);
    } else {
      res.json(annotation);
      //res.redirect("/camerasList");
    }
  });
});

module.exports = router;
