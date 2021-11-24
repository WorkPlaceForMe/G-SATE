var express = require('express')
var router = express.Router()
var Relations = require('../models/Relations')
const { validateUserAccessToken } = require('../middleware/AuthUser')
router.use(validateUserAccessToken)

router.get('/', function (req, res, next) {
  Relations.getAllForReal(function (err, rows) {
    if (err) {
      res.json(err)
    } else {
      res.json(rows)
    }
  })
})

module.exports = router
