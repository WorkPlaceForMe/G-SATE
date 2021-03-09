var express = require('express');
var router = express.Router();
var CustomerTrainingDetails = require('../models/CustomerTrainingDetails');
//Unsure

router.get('/', function(req, res, next) {
    CustomerTrainingDetails.cameras(function(err, rows) {
        if (err) {
            res.json(err);
        } else {
            res.json(rows);
        }
    });
});


module.exports = router;