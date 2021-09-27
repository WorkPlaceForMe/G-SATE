const fs = require('fs')
const express = require('express')
const router = express.Router()
const Annotation = require('../models/Annotation')
const elastic = require('elasticsearch')
const elasticIndex = 'image_annotations'
const elasticType = 'annotaions'

require('dotenv').config({
  path: './config.env',
})
//Unsure
const client = elastic.Client({
  // node: `${process.env.my_ip}:${process.env.server}`,
  host: process.env.elasticsearch_host,
})

router.get('/models', function (req, res, next) {
  Annotation.getModelDetails(function (err, annotation) {
    console.log('get Model')
    if (err) {
      res.json(err)
    } else {
      res.json(annotation)
    }
  })
})

router.post('/confirmed', function (req, res, next) {
  let body = req.body
  /**
   * Update ratio of (x, y) coordinates as per actual image width height
   */
  for (const index in body.data) {
    const SET = body.data[index]
    for (let i = 0; i < SET.results.length; i++) {
      for (let j = 0; j < SET.results[i].length; j++) {
        if (SET.results[i][j].x && SET.results[i][j].y) {
          body.data[index].results[i][j].x =
            (SET.results[i][j].x / SET.canvas_width) * SET.width
          body.data[index].results[i][j].y =
            (SET.results[i][j].y / SET.canvas_height) * SET.height
        }
      }
    }
  }
  /** ---------------- */

  let directory =
    process.env.resources2 + 'training_details/' + body.datasetName + '.json'
  fs.writeFileSync(directory, JSON.stringify(body.data))
  body.path = directory
  body.processed = 'No'
  Annotation.createImage(body, function (err, annotation) {
    if (err) {
      res.json(err)
    } else {
      res.json(body)
      // res.json(annotation);
      //res.redirect("/camerasList");
    }
  })
})

router.get('/image/:key', function (req, res, next) {
  const { key } = req.params
  if (!key) return res.status(400).send('Search key is required')

  client.search(
    {
      index: elasticIndex,
      type: elasticType,
      pretty: true,
      filter_path: 'hits.hits._source*',
      q: `data.label:${key}`,
      size: 10000,
    },
    function (err, data) {
      if (err) {
        console.log(err)
        res.status(500).send(err)
      } else {
        if (data && data.hits && data.hits.hits && data.hits.hits.length > 0) {
          const responseArray = []
          for (const element of data.hits.hits) {
            const checkingArray = []
            const imageData = element._source
            Object.keys(imageData).map(function (key) {
              const value = imageData[key]
              if (
                typeof value === 'undefined' ||
                value === null ||
                Object.is(value, NaN)
              ) {
                console.log(`1st checking image search >>>>> ${imageData}`)
                checkingArray.push(false)
              }
            })
            if (imageData.data && imageData.data.length > 0) {
              for (const val of imageData.data) {
                Object.keys(val).map(function (key) {
                  const value = val[key]
                  if (
                    typeof value === 'undefined' ||
                    value === null ||
                    Object.is(value, NaN)
                  ) {
                    console.log(`2nd checking image search >>>>> ${val}`)
                    checkingArray.push(false)
                  }
                })
              }
            }
            console.log(checkingArray, 'image searching')
            if (!checkingArray.includes(false)) {
              responseArray.push(element)
            }
          }

          res.status(200).send(responseArray)
        } else {
          res.status(200).send([])
        }
      }
    },
  )
})

router.get('/vehicle/:key', function (req, res, next) {
  const elasticVehicleIndex = 'vehicle_gsate'
  const elasticVehicleType = '_doc'

  const { key } = req.params
  if (!key) return res.status(400).send('Search key is required')

  client.search(
    {
      index: elasticVehicleIndex,
      type: elasticVehicleType,
      pretty: true,
      filter_path: 'hits.hits._source*',
      q: `class:${key}`,
      size: 10000,
    },
    function (err, data) {
      if (err) {
        console.log(err)
        res.status(500).send(err)
      } else {
        const responseArray = []
        let count = 0
        if (data && data.hits && data.hits.hits && data.hits.hits.length > 0) {
          for (const element of data.hits.hits) {
            const responseObj = {
              id: count,
              image:
                '/assets/shared-data/' +
                element._source.image_path.split('/').splice(5, 5).join('/'),
              width: element._source.cam_width,
              height: element._source.cam_height,
              checked: true,
              results: {
                Object: [
                  {
                    class: element._source.class,
                    boundingBox: {
                      left: element._source.x1,
                      top: element._source.y1,
                      width: element._source.x2 - element._source.x1,
                      height: element._source.y2 - element._source.y1,
                    },
                  },
                ],
              },
            }

            const checkingArray = []
            Object.keys(responseObj).map(function (key) {
              const value = responseObj[key]
              if (
                typeof value === 'undefined' ||
                value === null ||
                Object.is(value, NaN)
              ) {
                console.log(`1st checking vehicle search >>>>> ${responseObj}`)
                checkingArray.push(false)
              }
            })
            if (responseObj.results && responseObj.results.Object.length > 0) {
              Object.keys(responseObj.results.Object[0]).map(function (key) {
                const value = responseObj.results.Object[0][key]
                if (
                  typeof value === 'undefined' ||
                  value === null ||
                  Object.is(value, NaN)
                ) {
                  console.log(
                    `2nd checking vehicle search >>>>> ${responseObj.results.Object[0]}`,
                  )
                  checkingArray.push(false)
                }
              })
              if (responseObj.results.Object[0].boundingBox) {
                Object.keys(responseObj.results.Object[0].boundingBox).map(
                  function (key) {
                    const value = responseObj.results.Object[0].boundingBox[key]
                    if (
                      typeof value === 'undefined' ||
                      value === null ||
                      Object.is(value, NaN)
                    ) {
                      console.log(
                        `3rd checking vehicle search >>>>> ${responseObj.results.Object[0].boundingBox}`,
                      )
                      checkingArray.push(false)
                    }
                  },
                )
              }
            }
            console.log(checkingArray, 'vehicle searching')
            if (!checkingArray.includes(false)) {
              ++count
              responseArray.push(responseObj)
            }
          }
        }
        res.status(200).send(responseArray)
      }
    },
  )
})

router.post('/object-detection/confirmed', function (req, res, next) {
  console.log('object detection training confirmed')
  let body = req.body
  const elasticData = []

  /**
   * Update ratio of (x, y) coordinates as per actual image width height
   */
  for (const index in body.data) {
    const SET = body.data[index]
    for (let i = 0; i < SET.results.length; i++) {
      for (let j = 0; j < SET.results[i].length; j++) {
        if (SET.results[i][j].x && SET.results[i][j].y) {
          body.data[index].results[i][j].x =
            (SET.results[i][j].x / SET.canvas_width) * SET.width
          body.data[index].results[i][j].y =
            (SET.results[i][j].y / SET.canvas_height) * SET.height
        }
      }
      elasticData.push(
        { index: { _index: elasticIndex, _type: elasticType } },
        {
          image: SET.image,
          width: SET.width,
          height: SET.height,
          canvas_width: SET.canvas_width,
          canvas_height: SET.canvas_height,
          data: [...SET.results[i]],
        },
      )
    }
  }
  /** ---------------- */
  client.bulk(
    {
      body: elasticData,
    },
    function (err, data) {
      if (err) {
        console.log(err)
        return res.status(500).send(err)
      } else {
        console.log('Uploaded on elastic search...')
      }
    },
  )

  let directory =
    process.env.resources2 + 'training_details/' + body.datasetName + '.json'
  fs.writeFileSync(directory, JSON.stringify(body.data))
  body.path = directory
  body.processed = 'No'
  Annotation.createObject(req.body, function (err, annotation) {
    if (err) {
      res.json(err)
    } else {
      // res.json(annotation); // OLD RESPONSE
      /**
       * Return body with updated (x, y) coordinates
       */
      res.json(body)
      //res.redirect("/camerasList");
    }
  })
})

router.post('/time-slot/save', function (req, res) {
  res.json({
    inferencing_time_slot: {
      start_time: req.body.start_time,
      end_time: req.body.end_time,
    },
    traning_time_slot: {
      start_time: req.body.start_time,
      end_time: req.body.end_time,
    },
  })
})

module.exports = router
