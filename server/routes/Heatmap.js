var express = require('express')
const {
  validateUserAccessToken,
  validateApiKey,
} = require('../middleware/AuthUser')
var router = express.Router()
var hm = require('../models/Heatmap')
router.use(validateApiKey)
router.use(validateUserAccessToken)

router.get('/first/:st/:end/:camera_id', function (req, res, next) {
  hm.choosen1(req.params.camera_id, req.params.st, req.params.end, function (
    err,
    rows,
  ) {
    if (err) {
      res.json(err)
    } else {
      res.json(rows)
    }
  })
})

router.get('/first/:st/:end/:dwell/:camera_id', function (req, res, next) {
  hm.dwell1(
    req.params.camera_id,
    req.params.st,
    req.params.end,
    req.params.dwell,
    function (err, rows) {
      if (err) {
        res.json(err)
      } else {
        res.json(rows)
      }
    },
  )
})

router.get('/first/:camera_id', function (req, res, next) {
  hm.list1(req.params.camera_id, function (err, rows) {
    if (err) {
      res.json(err)
    } else {
      res.json(rows)
    }
  })
})

router.get('/zone', function (req, res, next) {
  hm.zone(function (err, rows) {
    if (err) {
      res.json(err)
    } else {
      res.json(rows)
    }
  })
})

module.exports = router
