var express = require('express')
const { validateUserAccessToken } = require('../middleware/AuthUser')
var router = express.Router()
var Image = require('../models/Image')
router.use(validateUserAccessToken)

router.get('/:id', function (req, res, next) {
  Image.getSome(req.params.id, function (err, rows) {
    if (err) {
      res.json(err)
    } else {
      console.log('rows*************************', rows)
      res.json(rows)
    }
  })
})

router.post('/', function (req, res, next) {
  Image.create(req.body, function (err, count) {
    if (err) {
      res.json(err)
    } else {
      res.json(count)
    }
  })
})

router.delete('/:id', function (req, res, next) {
  Image.delete(req.params.id, function (err, count) {
    if (err) {
      res.json(err)
    } else {
      res.json(count)
    }
  })
})

module.exports = router
