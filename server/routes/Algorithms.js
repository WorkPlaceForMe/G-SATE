var express = require('express')
var router = express.Router()
var Algorithm = require('../models/Algorithms')
var Relations = require('../models/Relations')
const fs = require('fs')

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

router.get('/custom', function (req, res, next) {
  Algorithm.getCustomAlgorithms(function (err, algos) {
    if (err) {
      res.json(err)
    } else {
      res.status(200).send(algos)
    }
  })
})

router.delete('/custom/:id', function (req, res, next) {
  const customAlgoId = req.params.id
  Algorithm.getCustomAlgorithmById(customAlgoId, function (err, customAlgo) {
    if (err) {
      res.json(err)
    } else {
      if (customAlgo.length > 0) {
        const dirName = `${process.env.modelsPath}${customAlgo[0].name}`
        console.log(dirName, 'dirName')
        if (fs.existsSync(dirName)) {
          console.log('dir exists')
          fs.rmdirSync(dirName, { recursive: true })
          if (fs.existsSync(dirName)) {
            console.log('dir not deleted')
            return res
              .status(400)
              .send({ message: 'Not able to delete the algorithm' })
          } else {
            console.log('dir deleted')
          }
        }

        Algorithm.deleteAlgorithm(customAlgoId, function (err, algos) {
          if (err) {
            res.json(err)
          } else {
            console.log(`${customAlgo[0].name}_gsate`)
            Algorithm.dropTable(`${customAlgo[0].name}_gsate`, function (
              err,
              success,
            ) {
              if (err) {
                res.json(err)
              } else {
                Relations.deleteByAlgoId(customAlgoId, function (err, deleted) {
                  if (err) {
                    res.json(err)
                  } else {
                    Relations.deleteFromRelationR(customAlgoId, function (
                      err,
                      deleted,
                    ) {
                      if (err) {
                        res.json(err)
                      } else {
                        res
                          .status(200)
                          .send({ message: 'Algorithm deleted successfully' })
                      }
                    })
                  }
                })
              }
            })
          }
        })
        //   }
      } else {
        res.status(400).send({ message: 'Algorithm not found' })
      }
    }
  })
})

module.exports = router
