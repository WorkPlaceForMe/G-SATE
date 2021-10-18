var express = require('express')
var router = express.Router()
var Algorithm = require('../models/Algorithms')

router.get('/', function (req, res, next) {
  Algorithm.list(function (err, rows) {
    if (err) {
      res.json(err)
    } else {
      res.json(rows)
    }
  })
})

router.post('/', function (req, res, next) {
  const algoName = req.body.name
  Algorithm.getOne(algoName, function (err, algorithm) {
    if (err) {
      res.json(err)
    } else {
      if (algorithm.length === 0) {
        Algorithm.list(function (err, list) {
          if (err) {
            res.json(err)
          } else {
            const algoDetails = {
              id: list[list.length - 1].id + 1,
              name: algoName,
              available: 1,
            }
            Algorithm.create(algoDetails, function (err, row) {
              if (err) {
                res.json(err)
              } else {
                Algorithm.createAlgorithmTable(algoName, function (err, table) {
                  if (err) {
                    res.json(err)
                  } else {
                    res.status(200).send({
                      algorithmAdded: true,
                      message: 'Algorithm added',
                    })
                  }
                })
              }
            })
          }
        })
      } else {
        res
          .status(200)
          .send({ algorithmAdded: false, message: 'Model already exists.' })
      }
    }
  })
})

module.exports = router
