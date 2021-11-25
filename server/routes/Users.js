var express = require('express')
const { validateApiKey } = require('../middleware/AuthUser')
var router = express.Router()
var User = require('../models/User')
router.use(validateApiKey)

router.get('/', function (req, res, next) {
  User.users(function (err, rows) {
    if (err) {
      res.json(err)
    } else {
      res.json(rows)
    }
  })
})

router.get('/search/:search', function (req, res, next) {
  User.search(req.params.search, function (err, rows) {
    if (err) {
      res.json(err)
    } else {
      res.json(rows)
    }
  })
})

router.get('/:id', function (req, res, next) {
  User.getOne(req.params.id, function (err, fields) {
    if (err) {
      res.json(err)
    } else {
      res.json(fields)
    }
  })
})

router.post('/', function (req, res, next) {
  User.create(req.body, function (err, rows) {
    if (err) {
      res.json(err)
    } else {
      res.json(req.body)
    }
  })
})

router.delete('/:id', function (req, res, next) {
  User.delete(req.params.id, function (err, count) {
    if (err) {
      res.json(err)
    } else {
      res.json(count)
    }
  })
})

router.put('/:id', function (req, res, next) {
  User.update(req.params.id, req.body, function (err, rows) {
    if (err) {
      res.json(err)
    } else {
      res.json(rows)
    }
  })
})

module.exports = router
