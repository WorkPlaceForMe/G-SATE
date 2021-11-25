var express = require('express')
const {
  validateUserAccessToken,
  validateApiKey,
} = require('../middleware/AuthUser')
var router = express.Router()
var Face = require('../models/Face')
router.use(validateApiKey)
router.use(validateUserAccessToken)

router.get('/:id', function (req, res, next) {
  Face.countBy(req.params.id, function (err, rows) {
    if (err) {
      res.json(err)
    } else {
      res.json(rows)
    }
  })
})

router.get('/', function (req, res, next) {
  Face.list(function (err, rows) {
    if (err) {
      res.json(err)
    } else {
      res.json(rows)
    }
  })
})

module.exports = router
