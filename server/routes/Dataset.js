const express = require('express');
const router = express.Router();
const Datasets = require('../models/Dataset');
const DsetController = require('../controller/Dataset');

router.get('/:which', function(req, res, next) {
    let which = req.params.which;
    Datasets.list(which, function(err, rows) {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(200).json(rows);
        }
    });
});

router.post('/process', function(req, res, next) {
    DsetController.process(req, res, next);
});

router.post('/cortarFrames', function(req, res, next) {
    DsetController.createDataset(req, res);
})

router.post('/upZip', function(req, res, next) {
    DsetController.unzipDataset(req, res);
});

router.post('/image/search/create', function(req, res, next) {
    DsetController.imageSeachDataset(req, res);
})

router.delete('/:id', function(req, res, next) {
    Datasets.delete(req.params.id, function(err, count) {
        if (err) {
            res.json(err);
        } else {
            res.json(count);
        }
    });
});

module.exports = router;