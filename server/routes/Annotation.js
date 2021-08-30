const fs = require("fs");
const express = require("express");
const router = express.Router();
const Annotation = require("../models/Annotation");
const elastic = require("elasticsearch");
const elasticIndex = "image_annotations";
const elasticType = "annotaions";
require("dotenv").config({
  path: "./config.env",
});
//Unsure
const client = elastic.Client({
  // node: `${process.env.my_ip}:${process.env.server}`,
  host: process.env.elasticsearch_host,
});

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
  const elasticData = [];

  /**
   * Update ratio of (x, y) coordinates as per actual image width height
   */
  for (const index in body.data) {
    const SET = body.data[index];
    for (let i = 0; i < SET.results.length; i++) {
      for (let j = 0; j < SET.results[i].length; j++) {
        if (SET.results[i][j].x && SET.results[i][j].y) {
          body.data[index].results[i][j].x =
            (SET.results[i][j].x / SET.canvas_width) * SET.width;
          body.data[index].results[i][j].y =
            (SET.results[i][j].y / SET.canvas_height) * SET.height;
        }
      }
      elasticData.push(
        { index: { _index: elasticIndex, _type: elasticType } },
        {
          image: SET.image,
          width: SET.width,
          height: SET.height,
          canvas_width: SET.canvas_width,
          canvas_height: SET.canvas_height,
          data: [...SET.results[i]],
        }
      );
    }
  }
  /** ---------------- */

  client.bulk(
    {
      body: elasticData,
    },
    function (err, data) {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      } else {
        console.log("Uploaded on elastic search...");
      }
    }
  );

  let directory =
    process.env.resources2 + "training_details/" + body.datasetName + ".json";
  fs.writeFileSync(directory, JSON.stringify(body.data));
  body.path = directory;
  body.processed = "No";
  Annotation.createImage(body, function (err, annotation) {
    if (err) {
      res.json(err);
    } else {
      res.json(body);
      // res.json(annotation);
      //res.redirect("/camerasList");
    }
  });
});

router.get("/image/:key", function (req, res, next) {
  const { key } = req.params;
  if (!key) return res.status(400).send("Search key is required");

    client.search({
      index: elasticIndex,
      pretty: true,
      filter_path: "hits.hits._source*",
      q: `data.label:${key}`,
    }, function (err, data) {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        res.status(200).send(result.hits.hits);
      }
    });
});

router.post("/object-detection/confirmed", function (req, res, next) {
  console.log("object detection training confirmed");
  let body = req.body;
  const elasticData = [];

  /**
   * Update ratio of (x, y) coordinates as per actual image width height
   */
  for (const index in body.data) {
    const SET = body.data[index];
    for (let i = 0; i < SET.results.length; i++) {
      for (let j = 0; j < SET.results[i].length; j++) {
        if (SET.results[i][j].x && SET.results[i][j].y) {
          body.data[index].results[i][j].x =
            (SET.results[i][j].x / SET.canvas_width) * SET.width;
          body.data[index].results[i][j].y =
            (SET.results[i][j].y / SET.canvas_height) * SET.height;
        }
      }
      elasticData.push(
        { index: { _index: elasticIndex, _type: elasticType } },
        {
          image: SET.image,
          width: SET.width,
          height: SET.height,
          canvas_width: SET.canvas_width,
          canvas_height: SET.canvas_height,
          data: [...SET.results[i]],
        }
      );
    }
  }
  /** ---------------- */
  client.bulk(
    {
      body: elasticData,
    },
    function (err, data) {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      } else {
        console.log("Uploaded on elastic search...");
      }
    }
  );

  let directory =
    process.env.resources2 + "training_details/" + body.datasetName + ".json";
  fs.writeFileSync(directory, JSON.stringify(body.data));
  body.path = directory;
  body.processed = "No";
  Annotation.createObject(req.body, function (err, annotation) {
    if (err) {
      res.json(err);
    } else {
      // res.json(annotation); // OLD RESPONSE
      /**
       * Return body with updated (x, y) coordinates
       */
      res.json(body);
      //res.redirect("/camerasList");
    }
  });
});

router.post("/time-slot/save", function (req, res) {
  res.json({
    inferencing_time_slot: {
      start_time: req.body.start_time,
      end_time: req.body.end_time,
    },
    traning_time_slot: {
      start_time: req.body.start_time,
      end_time: req.body.end_time,
    },
  });
});

module.exports = router;
