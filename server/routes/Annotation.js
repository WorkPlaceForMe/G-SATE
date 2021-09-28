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

// const checkDataHaveOrNot = (dataObj) => {
//   const checkingArray = []
//   Object.keys(dataObj).map(function (key) {
//     const value = dataObj[key]
//     if (
//       typeof value === 'undefined' ||
//       value === null ||
//       Object.is(value, NaN)
//     ) {
//       console.log(dataObj)
//       checkingArray.push(false)
//     }
//     if (typeof value === 'object' && !Array.isArray(value)) {
//       Object.keys(value).map(function (key) {
//         const objValue = value[key]
//         if (
//           typeof objValue === 'undefined' ||
//           objValue === null ||
//           Object.is(objValue, NaN)
//         ) {
//           console.log('2nd checking image search >>>>>')
//           console.log(objValue)
//           checkingArray.push(false)
//         }
//       })
//     }
//     if (typeof value === 'object' && Array.isArray(value)) {
//       for (const val of value) {
//         if (typeof val === 'object' && !Array.isArray(val)) {
//           Object.keys(val).map(function (key) {
//             const arrayOfObjValue = val[key]
//             if (
//               typeof arrayOfObjValue === 'undefined' ||
//               arrayOfObjValue === null ||
//               Object.is(arrayOfObjValue, NaN)
//             ) {
//               console.log('3rd checking image search >>>>>')
//               console.log(arrayOfObjValue)
//               checkingArray.push(false)
//             }
//           })
//         }
//       }
//     }
//   })
//   if (checkingArray.includes(false)) {
//     return false
//   } else {
//     return true
//   }
// }

// const elasticSearchFunction = (index, type) => {
//  return client
//     .search({
//       index: index,
//       type: type,
//       pretty: true,
//       filter_path: 'hits.hits._source*',
//       q: `class:${key}`,
//       size: 10000,
//     })
//     .then(
//       function (body) {
//         if (body && body.hits && body.hits.hits && body.hits.hits.length > 0) {
//           return body.hits.hits
//         } else {
//           return []
//         }
//       },
//       function (error) {
//         if (error) {
//           console.log(error)
//           res.status(500).send(error)
//         }
//       },
//     )
// }

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
          // preparing final response
          // if any result data contains null NaN or undefined value, remove it
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
                console.log('1st checking image search >>>>>')
                console.log(imageData)
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
                    console.log('2nd checking image search >>>>>')
                    console.log(val)
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
              image:
                '/assets/shared-data/' +
                element._source.image_path.split('/').splice(5, 5).join('/'),
              width: element._source.cam_width,
              height: element._source.cam_height,
              checked: true,
              resultObject: {
                class: element._source.class,
                boundingBox: {
                  left: element._source.x1,
                  top: element._source.y1,
                  width: element._source.x2 - element._source.x1,
                  height: element._source.y2 - element._source.y1,
                },
              },
            }

            // if any result data contains null NaN or undefined value, remove it
            const checkingArray = []
            Object.keys(responseObj).map(function (key) {
              const value = responseObj[key]
              if (
                typeof value === 'undefined' ||
                value === null ||
                Object.is(value, NaN)
              ) {
                console.log('1st checking vehicle search >>>>>')
                console.log(responseObj)
                checkingArray.push(false)
              }
            })
            if (responseObj.resultObject) {
              Object.keys(responseObj.resultObject).map(function (key) {
                const value = responseObj.resultObject[key]
                if (
                  typeof value === 'undefined' ||
                  value === null ||
                  Object.is(value, NaN)
                ) {
                  console.log('2nd checking vehicle search >>>>>')
                  console.log(responseObj.resultObject)
                  checkingArray.push(false)
                }
              })
              if (responseObj.resultObject.boundingBox) {
                Object.keys(responseObj.resultObject.boundingBox).map(function (
                  key,
                ) {
                  const value = responseObj.resultObject.boundingBox[key]
                  if (
                    typeof value === 'undefined' ||
                    value === null ||
                    Object.is(value, NaN)
                  ) {
                    console.log('3rd checking vehicle search >>>>> ')
                    console.log(responseObj.resultObject.boundingBox)
                    checkingArray.push(false)
                  }
                })
              }
            }

            if (!checkingArray.includes(false)) {
              responseArray.push(responseObj)
            }
          }
        }
        console.log(responseArray.length, '>>>>>>total result array length')
        // preparing final response by concating result if duplicate image data found
        const finalResponse = []
        for (const resultData of responseArray) {
          const resultObj = {
            id: count,
            image: resultData.image,
            width: resultData.width,
            height: resultData.height,
            checked: resultData.checked,
            results: {
              Object: [],
            },
          }

          for (let i = 0; i < finalResponse.length; i++) {
            if (finalResponse[i].image === resultObj.image) {
              resultObj['duplicate'] = true
              finalResponse[i].results.Object.push(resultData.resultObject)
            }
          }

          if (!resultObj.duplicate) {
            resultObj.results.Object.push(resultData.resultObject)
            finalResponse.push(resultObj)
            ++count
          }
        }
        console.log(finalResponse.length, '>>>>>>response array length')
        res.status(200).send(finalResponse)
      }
    },
  )
})

router.get('/analytics/elasticSearch/:key', async function (req, res, next) {
  const elasticVehicleIndex = 'vehicle_gsate'
  const elasticPersonIndex = 'person_gsate'
  const elasticClothingIndex = 'clothing_gsate'
  const elasticPpeIndex = 'ppe_gsate'
  const elasticDefectsIndex = 'defects_gsate'
  const elasticSearchType = '_doc'

  const { key } = req.params
  if (!key) return res.status(400).send('Search key is required')

  const resultArray = []

  await Promise.all([
    client
      .search({
        index: elasticVehicleIndex,
        type: elasticSearchType,
        pretty: true,
        filter_path: 'hits.hits._source*',
        q: `class:${key}`,
        size: 10000,
      })
      .then(
        function (body) {
          if (
            body &&
            body.hits &&
            body.hits.hits &&
            body.hits.hits.length > 0
          ) {
            console.log('vehicle search function called')
            resultArray.push(...body.hits.hits)
          }
        },
        function (error) {
          if (error) {
            console.log(error)
            res.status(500).send(error)
          }
        },
      ),
    client
      .search({
        index: elasticPersonIndex,
        type: elasticSearchType,
        pretty: true,
        filter_path: 'hits.hits._source*',
        q: `class:${key}`,
        size: 10000,
      })
      .then(
        function (body) {
          if (
            body &&
            body.hits &&
            body.hits.hits &&
            body.hits.hits.length > 0
          ) {
            console.log('person search function called')
            resultArray.push(...body.hits.hits)
          }
        },
        function (error) {
          if (error) {
            console.log(error)
            res.status(500).send(error)
          }
        },
      ),
    client
      .search({
        index: elasticClothingIndex,
        type: elasticSearchType,
        pretty: true,
        filter_path: 'hits.hits._source*',
        q: `class:${key}`,
        size: 10000,
      })
      .then(
        function (body) {
          if (
            body &&
            body.hits &&
            body.hits.hits &&
            body.hits.hits.length > 0
          ) {
            console.log('clothing search function called')
            resultArray.push(...body.hits.hits)
          }
        },
        function (error) {
          if (error) {
            console.log(error)
            res.status(500).send(error)
          }
        },
      ),
    client
      .search({
        index: elasticPpeIndex,
        type: elasticSearchType,
        pretty: true,
        filter_path: 'hits.hits._source*',
        q: `class:${key}`,
        size: 10000,
      })
      .then(
        function (body) {
          if (
            body &&
            body.hits &&
            body.hits.hits &&
            body.hits.hits.length > 0
          ) {
            console.log('ppe search function called')
            resultArray.push(...body.hits.hits)
          }
        },
        function (error) {
          if (error) {
            console.log(error)
            res.status(500).send(error)
          }
        },
      ),
    client
      .search({
        index: elasticDefectsIndex,
        type: elasticSearchType,
        pretty: true,
        filter_path: 'hits.hits._source*',
        q: `class:${key}`,
        size: 10000,
      })
      .then(
        function (body) {
          if (
            body &&
            body.hits &&
            body.hits.hits &&
            body.hits.hits.length > 0
          ) {
            console.log('ppe search function called')
            resultArray.push(...body.hits.hits)
          }
        },
        function (error) {
          if (error) {
            console.log(error)
            res.status(500).send(error)
          }
        },
      ),
  ])

  const responseArray = []
  let count = 0
  if (resultArray.length > 0) {
    for (const element of resultArray) {
      const responseObj = {
        image:
          '/assets/shared-data/' +
          element._source.image_path.split('/').splice(5, 5).join('/'),
        width: element._source.cam_width,
        height: element._source.cam_height,
        checked: true,
        resultObject: {
          class: element._source.class,
          boundingBox: {
            left: element._source.x1,
            top: element._source.y1,
            width: element._source.x2 - element._source.x1,
            height: element._source.y2 - element._source.y1,
          },
        },
      }

      // if any result data contains null NaN or undefined value, remove it
      const checkingArray = []
      Object.keys(responseObj).map(function (key) {
        const value = responseObj[key]
        if (
          typeof value === 'undefined' ||
          value === null ||
          Object.is(value, NaN)
        ) {
          console.log('1st checking vehicle search >>>>>')
          console.log(responseObj)
          checkingArray.push(false)
        }
      })
      if (responseObj.resultObject) {
        Object.keys(responseObj.resultObject).map(function (key) {
          const value = responseObj.resultObject[key]
          if (
            typeof value === 'undefined' ||
            value === null ||
            Object.is(value, NaN)
          ) {
            console.log('2nd checking vehicle search >>>>>')
            console.log(responseObj.resultObject)
            checkingArray.push(false)
          }
        })
        if (responseObj.resultObject.boundingBox) {
          Object.keys(responseObj.resultObject.boundingBox).map(function (key) {
            const value = responseObj.resultObject.boundingBox[key]
            if (
              typeof value === 'undefined' ||
              value === null ||
              Object.is(value, NaN)
            ) {
              console.log('3rd checking vehicle search >>>>> ')
              console.log(responseObj.resultObject.boundingBox)
              checkingArray.push(false)
            }
          })
        }
      }

      if (!checkingArray.includes(false)) {
        responseArray.push(responseObj)
      }
    }
  }
  console.log(responseArray.length, '>>>>>>total result array length')
  // preparing final response by concating result if duplicate image data found
  const finalResponse = []
  for (const resultData of responseArray) {
    const resultObj = {
      id: count,
      image: resultData.image,
      width: resultData.width,
      height: resultData.height,
      checked: resultData.checked,
      results: {
        Object: [],
      },
    }

    for (let i = 0; i < finalResponse.length; i++) {
      if (finalResponse[i].image === resultObj.image) {
        resultObj['duplicate'] = true
        finalResponse[i].results.Object.push(resultData.resultObject)
      }
    }

    if (!resultObj.duplicate) {
      resultObj.results.Object.push(resultData.resultObject)
      finalResponse.push(resultObj)
      ++count
    }
  }
  console.log(finalResponse.length, '>>>>>>response array length')
  res.status(200).send(finalResponse)
})

router.get('/analytics/elasticSearch-test/:key', async function (
  req,
  res,
  next,
) {
  const elasticSearchType = '_doc'
  const elasticIndexArray = [
    'vehicle_gsate',
    'person_gsate',
    'clothing_gsate',
    'ppe_gsate',
    'defects_gsate',
  ]

  const { key } = req.params
  if (!key) return res.status(400).send('Search key is required')

  client
    .search({
      index: elasticIndexArray,
      type: elasticSearchType,
      pretty: true,
      filter_path: 'hits.hits._source*',
      q: `class:${key}`,
      size: 10000,
    })
    .then(
      function (data) {
        if (data && data.hits && data.hits.hits && data.hits.hits.length > 0) {
          const responseArray = []
          let count = 0
          if (
            data &&
            data.hits &&
            data.hits.hits &&
            data.hits.hits.length > 0
          ) {
            for (const element of data.hits.hits) {
              const responseObj = {
                image:
                  '/assets/shared-data/' +
                  element._source.image_path.split('/').splice(5, 5).join('/'),
                width: element._source.cam_width,
                height: element._source.cam_height,
                checked: true,
                resultObject: {
                  class: element._source.class,
                  boundingBox: {
                    left: element._source.x1,
                    top: element._source.y1,
                    width: element._source.x2 - element._source.x1,
                    height: element._source.y2 - element._source.y1,
                  },
                },
              }

              // if any result data contains null NaN or undefined value, remove it
              const checkingArray = []
              Object.keys(responseObj).map(function (key) {
                const value = responseObj[key]
                if (
                  typeof value === 'undefined' ||
                  value === null ||
                  Object.is(value, NaN)
                ) {
                  console.log('1st checking vehicle search >>>>>')
                  console.log(responseObj)
                  checkingArray.push(false)
                }
              })
              if (responseObj.resultObject) {
                Object.keys(responseObj.resultObject).map(function (key) {
                  const value = responseObj.resultObject[key]
                  if (
                    typeof value === 'undefined' ||
                    value === null ||
                    Object.is(value, NaN)
                  ) {
                    console.log('2nd checking vehicle search >>>>>')
                    console.log(responseObj.resultObject)
                    checkingArray.push(false)
                  }
                })
                if (responseObj.resultObject.boundingBox) {
                  Object.keys(responseObj.resultObject.boundingBox).map(
                    function (key) {
                      const value = responseObj.resultObject.boundingBox[key]
                      if (
                        typeof value === 'undefined' ||
                        value === null ||
                        Object.is(value, NaN)
                      ) {
                        console.log('3rd checking vehicle search >>>>> ')
                        console.log(responseObj.resultObject.boundingBox)
                        checkingArray.push(false)
                      }
                    },
                  )
                }
              }

              if (!checkingArray.includes(false)) {
                responseArray.push(responseObj)
              }
            }
          }
          console.log(responseArray.length, '>>>>>>total result array length')
          // preparing final response by concating result if duplicate image data found
          const finalResponse = []
          for (const resultData of responseArray) {
            const resultObj = {
              id: count,
              image: resultData.image,
              width: resultData.width,
              height: resultData.height,
              checked: resultData.checked,
              results: {
                Object: [],
              },
            }

            for (let i = 0; i < finalResponse.length; i++) {
              if (finalResponse[i].image === resultObj.image) {
                resultObj['duplicate'] = true
                finalResponse[i].results.Object.push(resultData.resultObject)
              }
            }

            if (!resultObj.duplicate) {
              resultObj.results.Object.push(resultData.resultObject)
              finalResponse.push(resultObj)
              ++count
            }
          }
          console.log(finalResponse.length, '>>>>>>response array length')
          res.status(200).send(finalResponse)
        }
      },
      function (error) {
        if (error) {
          console.log(error)
          res.status(500).send(error)
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
