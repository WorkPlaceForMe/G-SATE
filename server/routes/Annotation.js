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

const dataExistsForVehicle = async (data) => {
  const checkingArray = []
  Object.keys(data).map(function (key) {
    if (!data[key]) {
      checkingArray.push(false)
    }
  })
  if (data.results && data.results.Object.length > 0) {
    Object.keys(data.results.Object[0]).map(function (key) {
      if (!data.results.Object[0][key]) {
        checkingArray.push(false)
      }
    })
    if (data.results.Object[0].boundingBox) {
      Object.keys(data.results.Object[0].boundingBox).map(function (key) {
        if (!data.results.Object[0].boundingBox[key]) {
          checkingArray.push(false)
        }
      })
    }
  }
  if (checkingArray.includes(false)) {
    return false
  } else {
    return true
  }
}

const dataExistsForImage = async (data) => {
  const checkingArray = []
  Object.keys(data).map(function (key) {
    if (!data[key]) {
      checkingArray.push(false)
    }
  })
  if (data.data && data.data.length > 0) {
    for (const val of data.data) {
      Object.keys(val).map(function (key) {
        if (!val[key]) {
          checkingArray.push(false)
        }
      })
    }
  }
  if (checkingArray.includes(false)) {
    return false
  } else {
    return true
  }
}

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
    async function (err, data) {
      if (err) {
        console.log(err)
        res.status(500).send(err)
      } else {
        if (data && data.hits && data.hits.hits && data.hits.hits.length > 0) {
          const responseArray = []
          for (const element of data.hits.hits) {
            const isExisting = await dataExistsForImage(element._source)
            if (isExisting) {
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
    async function (err, data) {
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
            const isExisting = await dataExistsForVehicle(responseObj)
            if (isExisting) {
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
