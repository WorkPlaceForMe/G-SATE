const express = require('express')
const router = express.Router()
const AuthController = require('../controller/Auth')
const {
  validateApiKey,
  validateSignupApi,
  validateLoginApi,
  validateOTPVerification,
  validateResendOTP,
} = require('../middleware/AuthUser')
router.use(validateApiKey)

router.post('/signup', validateSignupApi, function (req, res, next) {
  AuthController.signup(req, res, next)
})

router.post('/verify-otp', validateOTPVerification, function (req, res, next) {
  AuthController.verifyOTP(req, res, next)
})

router.put('/resend-otp', validateResendOTP, function (req, res, next) {
  AuthController.resendOTP(req, res, next)
})

router.get('/verification-status/:email', function (req, res, next) {
  AuthController.verificationStatus(req, res, next)
})

router.post('/login', validateLoginApi, function (req, res, next) {
  AuthController.login(req, res, next)
})

module.exports = router
