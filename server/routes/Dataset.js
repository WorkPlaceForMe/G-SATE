const express = require('express')
const router = express.Router()
const Datasets = require('../models/Dataset')
const DsetController = require('../controller/Dataset')
const { validateUserAccessToken } = require('../middleware/AuthUser')

router.get('/unannotated/:which', validateUserAccessToken, function (
  req,
  res,
  next,
) {
  let which = req.params.which
  Datasets.UnAnnotatedList(which, function (err, rows) {
    if (err) {
      res.status(500).json(err)
    } else {
      res.status(200).json(rows)
    }
  })
})

router.get('/annotated/:which', validateUserAccessToken, function (
  req,
  res,
  next,
) {
  let which = req.params.which
  Datasets.annotatedList(which, function (err, rows) {
    if (err) {
      res.status(500).json(err)
    } else {
      res.status(200).json(rows)
    }
  })
})

router.post('/process', validateUserAccessToken, function (req, res, next) {
  DsetController.process(req, res, next)
})

router.post('/process-without-vista', validateUserAccessToken, function (
  req,
  res,
  next,
) {
  DsetController.processWithoutVista(req, res, next)
})

router.post('/process/vista/single', validateUserAccessToken, function (
  req,
  res,
  next,
) {
  DsetController.processVistaSingleImage(req, res, next)
})

router.post('/process/vista/bulk', validateUserAccessToken, function (
  req,
  res,
  next,
) {
  DsetController.processVistaMultipleImage(req, res, next)
})

router.post('/process/vista/batch-images', validateUserAccessToken, function (
  req,
  res,
  next,
) {
  DsetController.processVistaBatchImages(req, res, next)
})

router.post('/cortarFrames', validateUserAccessToken, function (
  req,
  res,
  next,
) {
  DsetController.createDataset(req, res)
})

router.post('/upZip', function (req, res, next) {
  DsetController.unzipDataset(req, res)
})

router.post('/image/search/create', validateUserAccessToken, function (
  req,
  res,
  next,
) {
  DsetController.imageSeachDataset(req, res)
})

router.delete('/:name/:snippet_id/:type', validateUserAccessToken, function (
  req,
  res,
  next,
) {
  DsetController.deleteDataset(req, res)
})

router.post('/process/vista/upload-video', validateUserAccessToken, function (
  req,
  res,
  next,
) {
  DsetController.processVistaUploadVideo(req, res, next)
})

router.get('/process/vista/video-process', validateUserAccessToken, function (
  req,
  res,
  next,
) {
  DsetController.vistaVideoProcess(req, res, next)
})

module.exports = router
