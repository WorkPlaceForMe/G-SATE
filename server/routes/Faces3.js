var express = require('express')
const {
  validateUserAccessToken,
  validateApiKey,
} = require('../middleware/AuthUser')
var router = express.Router()
var Face = require('../models/Face')
router.use(validateApiKey)
router.use(validateUserAccessToken)

router.get('/', function (req, res, next) {
  Face.countEmotion(function (err, rows) {
    if (err) {
      res.json(err)
    } else {
      res.json(rows)
    }
  })
})

module.exports = router
