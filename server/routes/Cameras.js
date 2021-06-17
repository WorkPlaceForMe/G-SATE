const fs = require('fs');
var express = require('express');
var router = express.Router();
var Camera = require('../models/Camera');
const Relations = require('../models/Relations');


router.get('/', function (req, res, next) {
  Camera.cameras(function (err, rows) {
    if (err) {
      res.json(err);
    } else {
      res.json(rows);
    }
  });
});

router.get('/cams', function (req, res, next) {
  Camera.cams(function (err, rows) {
    if (err) {
      res.json(err);
    } else {
      res.json(rows);
    }
  });
});

router.get('/:id', function (req, res, next) {
  Camera.getOne(req.params.id, function (err, fields) {
    if (err) {
      res.json(err);
    } else {
      res.json(fields);
    }
  });
});

router.post('/', function (req, res, next) {
  Camera.create(req.body, function (err, rows) {
    if (err) {
      res.json(err);
    } else {
      res.json(req.body);
    }
  });
});

router.post('/:id', function (req, res, next) {
  /** 
   * Remove the file if it's exist
   */
  if(req.body.stored_vid == 'Yes') {
    fs.access(req.body.rtsp_in, fs.constants.F_OK, function(err) {
      if(!err) {
        fs.unlinkSync(req.body.rtsp_in);
      }
    });
  }
  /**
   * Remove all the relations
   */
  Relations.deleteByCameraId(req.params.id, function (rerr, count) {
    if (rerr) {
      res.json(rerr);
      return;
    }
    /**
     * Remove camera
     */
    Camera.delete(req.params.id, function (err, count) {
      if (err) {
        res.json(err);
      } else {
        res.json(count);
      }
    });
  });
});

router.put('/:id', function (req, res, next) {
  Camera.update(req.params.id, req.body, function (err, rows) {
    if (err) {
      res.json(err);
    } else {
      res.json(rows);
    }
  });
});


router.put('/newRt/:id', function (req, res, next) {
  Camera.updRt(req.params.id, req.body, function (err, rows) {
    if (err) {
      res.json(err);
    } else {
      res.json(rows);
    }
  });
});

module.exports = router;