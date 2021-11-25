const express = require('express')
const router = express.Router()
const videoController = require('../controller/Video')
const {
  validateUserAccessToken,
  validateApiKey,
} = require('../middleware/AuthUser')
router.use(validateApiKey)
router.use(validateUserAccessToken)

router.post('/upload', function (req, res, next) {
  videoController.upload(req, res)
})

router.post('/merge/:id', function (req, res, next) {
  videoController.merge(req, res)
})

module.exports = router
