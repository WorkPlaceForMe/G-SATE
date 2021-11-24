var express = require('express')
const { validateUserAccessToken } = require('../middleware/AuthUser')
var router = express.Router()
var Face = require('../models/Face')
router.use(validateUserAccessToken)

router.get('/', function (req, res, next) {
  Face.countAll(function (err, rows) {
    if (err) {
      res.json(err)
    } else {
      res.json(rows)
    }
  })
})

module.exports = router
