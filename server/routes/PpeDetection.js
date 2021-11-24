const express = require('express')
const router = express.Router()
const cp = require('child_process')
const request = require('request')
const fs = require('fs')
const { validateUserAccessToken } = require('../middleware/AuthUser')
router.use(validateUserAccessToken)

router.post('/object/detection', function (req, res, next) {
  if (!req.body.image) {
    res.status(400).send('Image is required')
    return
  }

  const image = req.body.image
  let dir = './objdet/darknet/data/' + image.split('/')[7]
  const command = `cd ./objdet/darknet && ./darknet detector test ../../../../kartik/graymatics.data ../../../../kartik/yolov3_deploy.cfg ../../../../kartik/yolov3_deploy.weights data/${
    image.split('/')[7]
  } -ext_output`

  saveImg(image, dir, function (err, data) {
    cp.exec(command, (err, data) => {
      console.log('Command LOG BY INT: ', command)
      console.log('Err LOG BY INT: ', err)
      console.log('Data LOG BY INT: ', data)

      if (err) {
        res.status(400).send(err)
      }

      console.log('type of data>>>>>>>>', typeof data)
      console.log('data>>>>>>>>>>>>>>', data)
      let result = []
      let single = []

      console.log('data splitted >>>>>>>>>>>', data.split('\n'))
      data.split('\n').forEach((ele) => {
        if (ele.includes('Predicted in') || ele == '') {
          console.log('element >>>>>>>>>>>>', ele)
        } else {
          let itm = ele.trim().split(' ')

          let obj1 = {
            x: itm[0],
            y: itm[1],
          }
          single.push(obj1)
          let obj2 = {
            x: itm[2],
            y: itm[3],
          }
          single.push(obj2)
          let obj3 = {
            general_detection: 'Yes',
          }
          single.push(obj3)
          let obj4 = {
            label: '',
          }
          single.push(obj4)
          result.push(single)
          single = []
        }
      })
      if (fs.existsSync(dir)) {
        fs.unlinkSync(dir)
      }
      res.json(result)
    })
  })
})

let saveImg = function (uri, filePath, callback) {
  try {
    let options = {
      url: uri,
      strictSSL: false,
    }
    request.head(options, function (err, res, body) {
      // console.log('SAVE_IMAGE', err, res, body);

      request(options)
        .pipe(fs.createWriteStream(filePath))
        .on('close', function () {
          callback()
        })
    })
  } catch (err) {
    console.log('Error>>>>>>>>>', err)
  }
}

module.exports = router
