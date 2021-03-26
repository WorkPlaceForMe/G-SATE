var express = require('express');
var router = express.Router();
var Annotation = require('../models/Annotation');
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
    console.log(req.body);
    Annotation.create(req.body, function(err, annotation) {
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