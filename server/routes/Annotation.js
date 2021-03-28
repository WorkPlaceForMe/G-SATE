const fs = require('fs');
const express = require('express');
const router = express.Router();
const Annotation = require('../models/Annotation');
//Unsure

router.get('/models', function(req, res, next) {
    Annotation.getModelDetails(function(err, annotation) {
        console.log("get Model");
        if (err) {
            res.json(err);
        } else {
            res.json(annotation);
        }
    });
});

router.post('/confirmed', function(req, res, next) {
    console.log("confirmed");
    let body = req.body;
    let directory = process.env.resources2 + 'training_details/' + body.datasetName + '.json';
    fs.writeFileSync(directory, JSON.stringify(body.data));
    body.path = directory;
    body.processed = 'No';
    Annotation.createImage(body, function(err, annotation) {
        if (err) {
            res.json(err);
        } else {
            console.log(annotation);
            res.json(annotation);
            res.redirect("/camerasList");
        }
    });
});

router.post('/object-detection/confirmed', function(req, res, next) {
    console.log("object detection training confirmed");
    console.log(req.body);
    Annotation.createObject(req.body, function(err, annotation) {
        if (err) {
            res.json(err);
        } else {
            console.log(annotation);
            res.json(annotation);
            res.redirect("/camerasList");
        }
    });
});

module.exports = router;