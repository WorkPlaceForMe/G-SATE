var express = require('express')
var router = express.Router()
var Relations = require('../models/Relations')
const { validateUserAccessToken } = require('../middleware/AuthUser')
router.use(validateUserAccessToken)

router.get('/:uuid', function (req, res, next) {
  Relations.getRels(req.params.uuid, function (err, rows) {
    if (err) {
      res.json(err)
    } else {
      res.json(rows)
    }
  })
})

router.post('/', function (req, res, next) {
  Relations.create(req.body, function (err, rows) {
    if (err) {
      res.json(err)
    } else {
      res.json(req.body)
    }
  })
})

router.delete('/:id', function (req, res, next) {
  Relations.delete(req.params.id, function (err, count) {
    if (err) {
      res.json(err)
    } else {
      res.json(count)
    }
  })
})

router.put('/:id', function (req, res, next) {
  Relations.update(req.params.id, req.body, function (err, rows) {
    if (err) {
      res.json(err)
    } else {
      res.json(rows)
    }
  })
})

module.exports = router
