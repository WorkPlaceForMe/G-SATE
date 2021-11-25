const express = require('express')
const router = express.Router()
const Datasets = require('../models/Dataset')
const DsetController = require('../controller/Dataset')
const {
  validateUserAccessToken,
  validateApiKey,
} = require('../middleware/AuthUser')
router.use(validateApiKey)
router.use(validateUserAccessToken)

router.get('/unannotated/:which', function (req, res, next) {
  let which = req.params.which
  Datasets.UnAnnotatedList(which, function (err, rows) {
    if (err) {
      res.status(500).json(err)
    } else {
      res.status(200).json(rows)
    }
  })
})

router.get('/annotated/:which', function (req, res, next) {
  let which = req.params.which
  Datasets.annotatedList(which, function (err, rows) {
    if (err) {
      res.status(500).json(err)
    } else {
      res.status(200).json(rows)
    }
  })
})

router.post('/process', function (req, res, next) {
  DsetController.process(req, res, next)
})

router.post('/process-without-vista', function (req, res, next) {
  DsetController.processWithoutVista(req, res, next)
})

router.post('/process/vista/single', function (req, res, next) {
  DsetController.processVistaSingleImage(req, res, next)
})

router.post('/process/vista/bulk', function (req, res, next) {
  DsetController.processVistaMultipleImage(req, res, next)
})

router.post('/process/vista/batch-images', function (req, res, next) {
  DsetController.processVistaBatchImages(req, res, next)
})

router.post('/cortarFrames', function (req, res, next) {
  DsetController.createDataset(req, res)
})

router.post('/upZip', function (req, res, next) {
  DsetController.unzipDataset(req, res)
})

router.post('/image/search/create', function (req, res, next) {
  DsetController.imageSeachDataset(req, res)
})

router.delete('/:name/:snippet_id/:type', function (req, res, next) {
  DsetController.deleteDataset(req, res)
})

router.post('/process/vista/upload-video', function (req, res, next) {
  DsetController.processVistaUploadVideo(req, res, next)
})

router.get('/process/vista/video-process', function (req, res, next) {
  DsetController.vistaVideoProcess(req, res, next)
})

module.exports = router
