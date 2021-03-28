const express = require('express');
const router = express.Router();
const videoController = require('../controller/Video');

router.post('/upload', function (req, res, next) {
    videoController.upload(req, res);
});


module.exports = router;