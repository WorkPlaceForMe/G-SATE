const express = require('express')
const router = express.Router()
const AdminController = require('../controller/Admin')
const {
  validateAdminAccessToken,
  validateUpdateAccessibility,
} = require('../middleware/AuthAdmin')
const { validateApiKey } = require('../middleware/AuthUser')
router.use(validateApiKey)
router.use(validateAdminAccessToken)

router.get('/users', function (req, res, next) {
  AdminController.getUsers(req, res, next)
})

router.put('/accessibility/:id', validateUpdateAccessibility, function (
  req,
  res,
  next,
) {
  AdminController.updateUserAccessibility(req, res, next)
})

module.exports = router
