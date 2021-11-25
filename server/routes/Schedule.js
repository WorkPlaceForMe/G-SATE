var express = require('express')
var router = express.Router()
var Schedule = require('../models/Schedule')
const {
  validateUserAccessToken,
  validateApiKey,
} = require('../middleware/AuthUser')

router.use(validateApiKey)
router.use(validateUserAccessToken)
router.get('/:user_id/:day', function (req, res, next) {
  Schedule.getSchedule(req.params.user_id, req.params.day, function (
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

router.get('/:user_id', function (req, res, next) {
  Schedule.getAllSchedule(req.params.user_id, function (err, rows) {
    if (err) {
      res.json(err)
    } else {
      res.json(rows)
    }
  })
})

router.post('/', function (req, res, next) {
  Schedule.create(req.body, function (err, rows) {
    if (err) {
      res.json(err)
    } else {
      res.json(req.body)
    }
  })
})
router.put('/:user_id', function (req, res, next) {
  Schedule.update(req.params.user_id, req.body, function (err, rows) {
    if (err) {
      res.json(err)
    } else {
      res.json(req.body)
    }
  })
})
router.delete('/:user_id', function (req, res, next) {
  Schedule.delete(req.params.user_id, function (err, count) {
    if (err) {
      res.json(err)
    } else {
      res.json(count)
    }
  })
})

module.exports = router
